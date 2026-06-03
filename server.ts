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

  // Helper to handle and simplify Gemini API keys errors (e.g. leaked or suspended keys)
  function handleGeminiError(err: any): string {
    const errMsg = err && typeof err === "object" ? JSON.stringify(err) + " " + (err.message || "") : String(err);
    if (
      errMsg.toLowerCase().includes("leaked") ||
      errMsg.toLowerCase().includes("permission_denied") ||
      errMsg.toLowerCase().includes("403") ||
      errMsg.toLowerCase().includes("unauthorized")
    ) {
      return "JFT Study App: Your Google Gemini API key has been reported as suspended or leaked. Please view AI Studio Settings on the top right to verify or update your GEMINI_API_KEY. All preloaded JFT course options, quizzes, vocabulary directories, and dictionaries remain completely available offline!";
    }
    return err.message || "An unexpected error occurred in JFT AI service.";
  }

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
          {
            text: prompt,
          },
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
      return res.status(500).json({ error: handleGeminiError(err) });
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
        contents: [{ text: prompt }],
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
      return res.status(500).json({ error: handleGeminiError(err) });
    }
  });

  // API endpoint to generate custom paragraph based on user's progress of OK cards
  app.post("/api/generate-paragraph", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY under Settings > Secrets.",
        });
      }

      const { okKanjis = [], okVerbs = [], okAdjectives = [] } = req.body;

      const prompt = `You are a Japanese Language Teacher (JFT-Basic and JLPT N4 specialist).
Your task is to write a cohesive, easy-to-read, natural Japanese paragraph (approx. 2-4 sentences, A2 standard) suited for a hospitality, work, or daily life scenario.

You are provided with lists of vocabulary marked as "OK" (already learned / remembered) by the user:
- OK Kanji characters: ${JSON.stringify(okKanjis)}
- OK Verbs: ${JSON.stringify(okVerbs)}
- OK Adjectives: ${JSON.stringify(okAdjectives)}

If the user has OK items, prioritize using some of them to formulate the paragraph. If the list is empty, write a standard beginner JFT-Basic A2 paragraph.

Provide the response as a valid JFTParagraph JSON object matching this schema:
{
  "titleSinhala": "Title of paragraph in Sinhala",
  "titleEnglish": "Title of paragraph in English",
  "fullEnglishTranslation": "Combined paragraph English translation",
  "fullSinhalaTranslation": "Combined paragraph Sinhala translation",
  "tokens": [
    {
      "id": "A unique token id like t-1, t-2",
      "text": "The exact word/phrase text as it appears in the paragraph, e.g. '昨日は', '車を', '行きます'",
      "kanji": "The Kanji form of this exact word/phrase (if applicable, otherwise text itself), e.g. '昨日', '白い', '車', '行く'",
      "kanjiChar": "The core single Kanji character involved inside this word (if any, e.g. '昨' for '昨日', '白' for '白い', '車' for '車', '行' for '行きます'). If none, leave empty string.",
      "hiragana": "The plain Hiragana representation of this exact word, e.g. 'きのう', 'しろい', 'くるま', 'いきます'",
      "type": "Must be one of 'kanji' | 'verb' | 'adjective' | 'particle' | 'other'",
      "englishMeaning": "Corresponding word translation in English",
      "sinhalaMeaning": "Corresponding word translation in Sinhala"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titleSinhala: { type: Type.STRING },
              titleEnglish: { type: Type.STRING },
              fullEnglishTranslation: { type: Type.STRING },
              fullSinhalaTranslation: { type: Type.STRING },
              tokens: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    kanji: { type: Type.STRING },
                    kanjiChar: { type: Type.STRING },
                    hiragana: { type: Type.STRING },
                    type: { type: Type.STRING },
                    englishMeaning: { type: Type.STRING },
                    sinhalaMeaning: { type: Type.STRING }
                  },
                  required: ["id", "text", "type", "englishMeaning", "sinhalaMeaning"]
                }
              }
            },
            required: ["titleSinhala", "titleEnglish", "fullEnglishTranslation", "fullSinhalaTranslation", "tokens"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No paragraph response generated");
      }

      const parsedData = JSON.parse(responseText.trim());
      return res.json(parsedData);
    } catch (err: any) {
      console.error("Paragraph Generation Error:", err);
      return res.status(500).json({ error: handleGeminiError(err) });
    }
  });

  // API endpoint for Real Time Translator
  app.post("/api/translate-photo", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY under Secrets.",
        });
      }

      const { imageBase64, simulateText, mode } = req.body;
      const contentsList: any[] = [];

      if (imageBase64) {
        try {
          const base64Data = imageBase64.includes(";base64,")
            ? imageBase64.split(";base64,")[1]
            : imageBase64;
          
          contentsList.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          });
        } catch (e) {
          console.error("Base64 parsing error:", e);
        }
      }

      const prompt = `
You are an expert Japanese, Sinhala, and English translator assistant (JFT-Basic and JLPT N4 specialist).
Analyze the input text. If an image is provided, perform OCR to extract the written text from the image. If 'simulateText' is provided and the image is missing, analyze the 'simulateText' instead.

Identify the source text language (Japanese, Sinhala, or English).
- If the text is in Japanese:
  1. Translate the entire passage into ${mode === "english" ? "English" : "Sinhala"}.
  2. Perform a sentence-by-sentence translation breakdown of the passage into ${mode === "english" ? "English" : "Sinhala"}.
  3. Identify all Japanese particles (e.g. は, が, を, に, で, と, も, から, まで, へ, etc.) and grammar points, and explain in ${mode === "english" ? "English" : "Sinhala"} why those specific particles/grammar rules were used in this context.
- If the text is in Sinhala or English:
  1. Translate the entire passage into Japanese.
  2. Perform a sentence-by-sentence translation breakdown of the resulting Japanese passage.
  3. Analyze the Japanese translations sentence-by-sentence, identify all Japanese particles and grammar points, and explain in ${mode === "english" ? "English" : "Sinhala"} why those particles/grammar rules are used.

${simulateText ? `For reference, the simulated/original text provided is: "${simulateText}"` : ""}

Generate a strictly valid JSON response conforming exactly to this structure:
{
  "recognizedText": "The extracted or simulated original text",
  "sourceLanguage": "japanese" | "sinhala" | "english",
  "targetLanguage": "japanese" | "sinhala" | "english",
  "fullTranslation": "The full passage translation",
  "sentences": [
    {
      "japanese": "The Japanese sentence (original or translated)",
      "reading": "Furigana pronunciation / Hiragana of the Japanese sentence",
      "translation": "The corresponding translation (in Sinhala or English based on mode/rules)",
      "grammarFeatures": [
        {
          "element": "The particle or grammar point (e.g. は, に, ～たい)",
          "explanation": "Friendly, clear explanation in the target language (${mode === "english" ? "English" : "Sinhala"}) explaining why it was used here"
        }
      ]
    }
  ]
}

Ensure the output is valid JSON only, without any markdown fence wrappers.
`;

      contentsList.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsList,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recognizedText: { type: Type.STRING },
              sourceLanguage: { type: Type.STRING },
              targetLanguage: { type: Type.STRING },
              fullTranslation: { type: Type.STRING },
              sentences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    japanese: { type: Type.STRING },
                    reading: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    grammarFeatures: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          element: { type: Type.STRING },
                          explanation: { type: Type.STRING },
                        },
                        required: ["element", "explanation"],
                      },
                    },
                  },
                  required: ["japanese", "reading", "translation", "grammarFeatures"],
                },
              },
            },
            required: ["recognizedText", "sourceLanguage", "targetLanguage", "fullTranslation", "sentences"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No translation details received from Gemini");
      }

      const result = JSON.parse(responseText.trim());
      return res.json(result);
    } catch (err: any) {
      console.error("Realtime Translation Error:", err);
      return res.status(500).json({ error: handleGeminiError(err) });
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
