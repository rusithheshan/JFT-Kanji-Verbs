import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

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

  // Simple file-backed profiles storage for shared leaderboard
  const PROFILES_FILE = path.join(process.cwd(), "profiles.json");

  function getProfilesSafe(): any[] {
    try {
      if (fs.existsSync(PROFILES_FILE)) {
        const raw = fs.readFileSync(PROFILES_FILE, "utf8");
        return JSON.parse(raw) || [];
      }
    } catch (e) {
      console.error("Error reading profiles.json:", e);
    }
    return [];
  }

  function saveProfilesSafe(profiles: any[]) {
    try {
      fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), "utf8");
    } catch (e) {
      console.error("Error writing profiles.json:", e);
    }
  }

  // Safe helper to hash email to hide it from DevTools/public payload while keeping comparisons working
  function hashEmailSafe(email: string): string {
    if (!email) return "anonymous";
    let hash = 0;
    const lower = email.trim().toLowerCase();
    for (let i = 0; i < lower.length; i++) {
      hash = (hash << 5) - hash + lower.charCodeAt(i);
      hash |= 0;
    }
    return "u_" + Math.abs(hash);
  }

  // Get active shared leaderboard (scrubbed of emails/phone numbers for critical privacy)
  app.get("/api/leaderboard", (req, res) => {
    try {
      const list = getProfilesSafe();
      
      const scrubbed = list.map((user) => {
        return {
          id: hashEmailSafe(user.email || ''),
          username: user.username || 'Learner',
          avatar: user.avatar || '🦊',
          targetExam: user.targetExam || 'JFT-Basic',
          kanjiProgress: Number(user.kanjiProgress || 0),
          verbsProgress: Number(user.verbsProgress || 0),
          adjectivesProgress: Number(user.adjectivesProgress || 0),
          grammarProgress: Number(user.grammarProgress || 0),
          totalProgress: Number(user.totalProgress || 0),
          joinedAt: user.joinedAt || user.updatedAt || ''
        };
      });

      const sorted = scrubbed.sort((a, b) => b.totalProgress - a.totalProgress);
      return res.json({ leaderboard: sorted });
    } catch (err) {
      console.error("Leaderboard loading error:", err);
      return res.status(500).json({ error: "Failed to load leaderboard" });
    }
  });

  // Get profile data with full progress maps
  app.get("/api/profile/get", (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: "Missing required email parameter." });
      }

      const list = getProfilesSafe();
      const matched = list.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        const scrubbed = { ...matched };
        delete (scrubbed as any).password;
        return res.json({ found: true, profile: scrubbed });
      } else {
        return res.json({ found: false });
      }
    } catch (err) {
      console.error("Profile load error:", err);
      return res.status(500).json({ error: "Failed to fetch profile details" });
    }
  });

  // Simple, password-less entry: Get or Create a fresh new Profile using Name & Exam
  app.post("/api/auth/enter", (req, res) => {
    try {
      const { username, targetExam = "JFT-Basic", avatar = "🦊" } = req.body;
      if (!username || !username.trim()) {
        return res.status(400).json({ error: "කරුණාකර ඔබගේ නම ඇතුළත් කරන්න. (Please provide a name)." });
      }

      const cleanName = username.trim();
      // Generate a brand-new unique account signature timestamped email every time they sign in
      // This ensures that any logout + login combo starts progress completely cleared from 0
      // while preserving their previous scores in the leaderboard json dataset permanently.
      const email = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now() + "@student.com";
      const list = getProfilesSafe();
      const now = new Date().toISOString();

      const newProfile = {
        email: email,
        phoneNumber: "",
        password: "",
        username: cleanName,
        avatar: avatar,
        targetExam: targetExam,
        kanjiProgress: 0,
        verbsProgress: 0,
        adjectivesProgress: 0,
        grammarProgress: 0,
        kanjiProgressMap: {},
        verbsProgressMap: {},
        adjectivesProgressMap: {},
        grammarProgressMap: {},
        totalProgress: 0,
        updatedAt: now,
        joinedAt: now
      };

      list.push(newProfile);
      saveProfilesSafe(list);

      const savedProfile = { ...newProfile };
      delete (savedProfile as any).password;
      return res.json({ success: true, profile: savedProfile });
    } catch (err) {
      console.error("Auth enter error:", err);
      return res.status(500).json({ error: "ගිණුමට ඇතුල් වීමට නොහැකි විය. Server entry failure." });
    }
  });

  // Sync profile data and study scores with detailed progress maps
  app.post("/api/profile/sync", (req, res) => {
    try {
      const {
        email,
        username,
        avatar,
        kanjiProgress = 0,
        verbsProgress = 0,
        adjectivesProgress = 0,
        grammarProgress = 0,
        kanjiProgressMap = {},
        verbsProgressMap = {},
        adjectivesProgressMap = {},
        grammarProgressMap = {}
      } = req.body;

      if (!email || !username) {
        return res.status(400).json({ error: "Missing required profile credentials (email, username)." });
      }

      const list = getProfilesSafe();
      let matchedIdx = list.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

      const totalProgress = Number(kanjiProgress) + Number(verbsProgress) + Number(adjectivesProgress) + Number(grammarProgress);
      const now = new Date().toISOString();

      const existingData = matchedIdx >= 0 ? list[matchedIdx] : {};

      const profileObj = {
        email: email.toLowerCase(),
        phoneNumber: req.body.phoneNumber || existingData.phoneNumber || "",
        username: username,
        password: existingData.password || req.body.password || "",
        targetExam: req.body.targetExam || existingData.targetExam || "OTHER",
        avatar: avatar || "👤",
        kanjiProgress: Number(kanjiProgress),
        verbsProgress: Number(verbsProgress),
        adjectivesProgress: Number(adjectivesProgress),
        grammarProgress: Number(grammarProgress),
        kanjiProgressMap: Object.keys(kanjiProgressMap).length > 0 ? kanjiProgressMap : (existingData.kanjiProgressMap || {}),
        verbsProgressMap: Object.keys(verbsProgressMap).length > 0 ? verbsProgressMap : (existingData.verbsProgressMap || {}),
        adjectivesProgressMap: Object.keys(adjectivesProgressMap).length > 0 ? adjectivesProgressMap : (existingData.adjectivesProgressMap || {}),
        grammarProgressMap: Object.keys(grammarProgressMap).length > 0 ? grammarProgressMap : (existingData.grammarProgressMap || {}),
        totalProgress: totalProgress,
        updatedAt: now,
        joinedAt: matchedIdx >= 0 ? list[matchedIdx].joinedAt : now
      };

      if (matchedIdx >= 0) {
        list[matchedIdx] = profileObj;
      } else {
        list.push(profileObj);
      }

      saveProfilesSafe(list);
      return res.json({ success: true, profile: profileObj });
    } catch (err: any) {
      console.error("Profile sync error:", err);
      return res.status(500).json({ error: "Failed to sync profile" });
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

  // API endpoint to generate a mnemonic image for a Kanji character
  app.post("/api/generate-mnemonic-image", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY under Settings > Secrets.",
        });
      }

      const { kanji, englishMeaning, sinhalaMeaning } = req.body;
      if (!kanji) {
        return res.status(400).json({ error: "Missing 'kanji' to generate mnemonic for." });
      }

      const prompt = `A clear, beautiful, minimalist visual illustration and sketch acting as a memorable mnemonic drawing to remember the Japanese Kanji character: '${kanji}' which means '${englishMeaning || "unknown"}' (${sinhalaMeaning || "not specified"}). Show how the shape of the kanji character lines relate to the physical object or concept, creating a very helpful, cute, clean and easily recognizable memory link. Clean white background, minimalist cozy watercolor sketch style.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let base64Image = "";
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }

      if (!base64Image) {
        throw new Error("No inline raw image data found in Gemini response parts. Ensure the Gemini API key has access to image models.");
      }

      const imageUrl = `data:image/png;base64,${base64Image}`;
      return res.json({ imageUrl });
    } catch (err: any) {
      console.error("Mnemonic image generation error:", err);
      return res.status(500).json({ error: handleGeminiError(err) });
    }
  });

  // API endpoint to generate custom paragraph or conversation based on user's selected progress filters
  app.post("/api/generate-paragraph", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY under Settings > Secrets.",
        });
      }

      const { 
        okKanjis = [], 
        okVerbs = [], 
        okAdjectives = [], 
        notYetKanjis = [], 
        notYetVerbs = [], 
        notYetAdjectives = [],
        vocabularyFilter = "all", // "all" | "ok" | "not_yet"
        contentType = "paragraph"  // "paragraph" | "conversation"
      } = req.body;

      const prompt = `You are an elite Japanese Language Teacher specializing in JFT-Basic A2 and JLPT N5/N4 syllabus.
Your task is to write an educational study package of type: "${contentType}" (either a single-screen JLPT/JFT reading comprehension paragraph OR an interactive dialogue/conversation between Speaker A and Speaker B).

Use the following vocabulary lists according to the selected filter: "${vocabularyFilter}" (which indicates if we prioritize OK/learned words, or if we focus on Not Yet learned words to practice them, or if we use All words).

Progress Lists:
1. OK/Learned Vocabulary:
- Kanji characters: ${JSON.stringify(okKanjis)}
- Verbs: ${JSON.stringify(okVerbs)}
- Adjectives: ${JSON.stringify(okAdjectives)}

2. Not Yet Learned Vocabulary (Need practice):
- Kanji characters: ${JSON.stringify(notYetKanjis)}
- Verbs: ${JSON.stringify(notYetVerbs)}
- Adjectives: ${JSON.stringify(notYetAdjectives)}

Guidelines:
- If vocabularyFilter is "ok", construct the Japanese text prioritizing the "OK/Learned" words.
- If vocabularyFilter is "not_yet", construct the Japanese text incorporating as many "Not Yet Learned" words as possible to let the student practice them.
- If vocabularyFilter is "all", design a rich, standard JFT-Basic/JLPT level Japanese text mixing both.
- Ensure the text is natural, beautiful, and completely beginner-friendly (A2 / N5 / N4).
- Break the entire text into "tokens" (individual words, particles, verbs, adjectives, etc.) for easy hover-learning.
- If the type is "conversation", make sure to detail each line spoke by Speaker A and Speaker B in the "textLines" array. If it is a "paragraph", write the paragraph lines in "textLines" with "speaker" set to empty or a sequential prefix.
- CRITICAL: Generate exactly 5 reading/comprehension multiple-choice questions in Japanese based on this text.
  Each question must have:
  - "questionJapanese": A clear Japanese question about the meaning, grammar, or scenario of the text.
  - "options": An array of exactly 4 Japanese answers/options representing keys 'a', 'b', 'c', and 'd'.
  - "correctOptionKey": The correct option key ('a', 'b', 'c', or 'd').
  - "explanationSinhala": A descriptive, clear, and high-quality explanation written in Sinhala explaining why that option is correct based on the text. Explain grammar rules, kanji, or sentence meanings in a friendly, helpful Sinhala tutor voice.

Provide the response as a valid JSON object matching this schema:
{
  "titleSinhala": "Title translated to Sinhala",
  "titleEnglish": "Title translated to English",
  "contentType": "paragraph" or "conversation",
  "fullEnglishTranslation": "The entire text translated to flowing English",
  "fullSinhalaTranslation": "The entire text translated to flowing beautiful Sinhala",
  "textLines": [
    {
      "speaker": "A or B (or leave empty if paragraph)",
      "japanese": "The exact Japanese line",
      "english": "English translation for this line",
      "sinhala": "Sinhala translation for this line"
    }
  ],
  "tokens": [
    {
      "id": "A unique token id like t-1, t-2",
      "text": "The exact Japanese word/phrase text as it appears in the passage, e.g. '昨日は', '車を', '行きます'",
      "kanji": "The Kanji form of this exact word/phrase (if applicable, otherwise text itself), e.g. '昨日', '白い', '車', '行く'",
      "kanjiChar": "The core single Kanji character involved inside this word (if any, e.g. '昨', '白', '車', '行'). If none, leave empty string.",
      "hiragana": "The plain Hiragana representation of this exact word, e.g. 'きのう', 'しろい', 'くるま', 'いきます'",
      "type": "Must be one of 'kanji' | 'verb' | 'adjective' | 'particle' | 'grammar' | 'other'",
      "englishMeaning": "Corresponding word translation in English",
      "sinhalaMeaning": "Corresponding word translation in Sinhala"
    }
  ],
  "questions": [
    {
      "id": "q-1 through q-5",
      "questionJapanese": "The question text in Japanese",
      "options": ["Option a", "Option b", "Option c", "Option d"],
      "correctOptionKey": "a or b or c or d",
      "explanationSinhala": "Detailed explanation of the correct option and context in Sinhala"
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
              contentType: { type: Type.STRING },
              fullEnglishTranslation: { type: Type.STRING },
              fullSinhalaTranslation: { type: Type.STRING },
              textLines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    speaker: { type: Type.STRING },
                    japanese: { type: Type.STRING },
                    english: { type: Type.STRING },
                    sinhala: { type: Type.STRING }
                  },
                  required: ["speaker", "japanese", "english", "sinhala"]
                }
              },
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
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    questionJapanese: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctOptionKey: { type: Type.STRING },
                    explanationSinhala: { type: Type.STRING }
                  },
                  required: ["id", "questionJapanese", "options", "correctOptionKey", "explanationSinhala"]
                }
              }
            },
            required: ["titleSinhala", "titleEnglish", "contentType", "fullEnglishTranslation", "fullSinhalaTranslation", "textLines", "tokens", "questions"]
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
