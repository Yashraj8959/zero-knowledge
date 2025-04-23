import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ✅ Validate topic input
const validateTopic = (topic) => {
  return typeof topic === "string" && topic.trim().length > 2;
};

// 1️⃣ Prompt Constructor
const constructPrompt = (topic) => {
  return `Generate 10 multiple choice questions on ${topic} with 4 options each. Also return the correct answer for each question. Format like:
1. What is X?
a) Option1
b) Option2
c) Option3
d) Option4
Answer: b) Option2`;
};

// 2️⃣ Call Gemini 2.0 Flash API
const callGeminiAPI = async (prompt, retries = 2) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result) throw new Error("Empty response from Gemini API");

      return result;

    } catch (error) {
      console.warn(`⚠️ Gemini API attempt ${i + 1} failed:`, error.message);
      if (i === retries) throw new Error("Gemini API failed after multiple attempts");
    }
  }
};

// 3️⃣ Parse Gemini Response to JSON Format
const parseGeminiMCQs = (rawText) => {
  const questions = rawText.trim().split(/\n(?=\d+\.)/);
  if (!questions || questions.length < 5) throw new Error("Insufficient questions generated");

  return questions.map((block, idx) => {
    const lines = block.trim().split("\n");
    if (lines.length < 6) throw new Error(`Question ${idx + 1} format is incorrect`);

    const question = lines[0].replace(/^\d+\.\s*/, "").trim();
    const options = lines.slice(1, 5).map(opt => opt.slice(3).trim()); // removes a), b) etc.
    const answerLine = lines.find(l => l.toLowerCase().includes("answer"));

    const correctAnswer = answerLine?.split(":")[1]?.trim();
    if (!correctAnswer) throw new Error(`Correct answer missing in question ${idx + 1}`);

    return { question, options, correctAnswer };
  });
};

// 4️⃣ Main Controller
export const generateQuizFromGemini = async (req, res) => {
  try {
    const { topic } = req.body;

    // 🛑 Input validation
    if (!validateTopic(topic)) {
      return res.status(400).json({ success: false, message: "Invalid topic provided" });
    }

    // 🧠 Build prompt & call Gemini Flash
    const prompt = constructPrompt(topic);
    const geminiRaw = await callGeminiAPI(prompt);
    const quiz = parseGeminiMCQs(geminiRaw);

    // ✅ Send it to frontend
    return res.status(200).json({
      success: true,
      message: "Quiz generated using Gemini 2.0 Flash 🚀",
      quiz,
    });

  } catch (error) {
    console.error("❌ Gemini 2.0 Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Quiz generation failed",
      error: error.message || "Internal Server Error",
    });
  }
};
