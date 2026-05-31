import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Make sure we parse standard JSON bodies and large Base64 uploads safely.
  app.use(express.json({ limit: "50mb" }));

  // Shared Gemini client configured according to system instructions
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // API endpoint to parse the JFT Kanji PDF using the Gemini API
  app.post("/api/parse-pdf", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY under Settings > Secrets.",
        });
      }

      const { pdfBase64 } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ error: "Missing 'pdfBase64' payload." });
      }

      const prompt = `Analyze the attached JFT-Basic Kanji study PDF in detail.
Extract all Kanji characters along with their readings (with okurigana or furigana), onyomi readings, kunyomi readings, english translation, and Sinhala translation.
Convert this structural data into an structured JSON array of cards conforming exactly to this schema:
{
  "kanji": "The Japanese Kanji character (include okurigana if applicable, e.g. 行く)",
  "furigana": "The reading of the kanji in Hiragana (e.g. いく)",
  "onyomi": "Onyomi readings (romaji/katakana, e.g. コウ)",
  "kunyomi": "Kunyomi readings (romaji/hiragana, e.g. い.く)",
  "sinhalaMeaning": "Sinhala meaning using Sinhala characters (e.g. යනවා)",
  "englishMeaning": "Short, clear English meaning (e.g. to go)"
}

Ensure your output is a strictly formatted JSON array containing all processed entries from the PDF file (aim for the full deck of JFT Kanji, up to 450 items if present). Do not truncate the list.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
          prompt,
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "Array of fully analyzed JFT Kanji cards containing translations",
            items: {
              type: Type.OBJECT,
              properties: {
                kanji: { type: Type.STRING },
                furigana: { type: Type.STRING },
                onyomi: { type: Type.STRING },
                kunyomi: { type: Type.STRING },
                sinhalaMeaning: { type: Type.STRING },
                englishMeaning: { type: Type.STRING },
              },
              required: [
                "kanji",
                "furigana",
                "onyomi",
                "kunyomi",
                "sinhalaMeaning",
                "englishMeaning",
              ],
            },
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty representation returned from Gemini response");
      }

      const cards = JSON.parse(responseText.trim());
      
      // Inject unique IDs
      const formattedCards = cards.map((card: any, index: number) => ({
        id: `parsed_${Date.now()}_${index}`,
        ...card,
      }));

      return res.json({ cards: formattedCards });
    } catch (err: any) {
      console.error("PDF Parsing Error:", err);
      return res.status(500).json({ error: err.message || "Failed to process and analyze the PDF file." });
    }
  });

  // API endpoint to generate information for individual custom-added Kanji
  app.post("/api/generate-card", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY under Settings > Secrets.",
        });
      }

      const { kanji } = req.body;
      if (!kanji) {
        return res.status(400).json({ error: "Missing 'kanji' to search and generate card details for." });
      }

      const prompt = `Research the Japanese Kanji: "${kanji}".
Generate comprehensive JFT-Basic study details for this Kanji.
You must provide the furigana reading in Hiragana, the Onyomi, Kunyomi readings, a highly accurate and direct translations in Sinhala (in Sinhala script), and English.
Exposures must match this schema strictly:
{
  "kanji": "${kanji}",
  "furigana": "reading in Hiragana",
  "onyomi": "Onyomi",
  "kunyomi": "Kunyomi",
  "sinhalaMeaning": "Sinhala meaning using Sinhala characters",
  "englishMeaning": "English meaning"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kanji: { type: Type.STRING },
              furigana: { type: Type.STRING },
              onyomi: { type: Type.STRING },
              kunyomi: { type: Type.STRING },
              sinhalaMeaning: { type: Type.STRING },
              englishMeaning: { type: Type.STRING },
            },
            required: [
              "kanji",
              "furigana",
              "onyomi",
              "kunyomi",
              "sinhalaMeaning",
              "englishMeaning",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty details returned from Gemini");
      }

      const cardDetails = JSON.parse(responseText.trim());
      return res.json({ id: `ai_${Date.now()}`, ...cardDetails });
    } catch (err: any) {
      console.error("Single Generation Error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate custom card." });
    }
  });

  // Serve static assets and routing in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting up and listening on port ${PORT}`);
  });
}

startServer();
