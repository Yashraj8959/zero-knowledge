import axios from "axios";
import mongoose from "mongoose";
import QuizAttempt from "../Modal/QuizModel.js"; // Assuming the QuizAttempt model is set correctly

// 🧠 Prepare Gemini 2.5 prompt for feedback
const prepareGeminiPrompt = (score, total, wrongAnswers, topic) => {
  const wrongQuestionsText = wrongAnswers.map((q) => q.question).join(", ");
  return `
    User got ${score}/${total} in ${topic}.
    Wrong answers were on: ${wrongQuestionsText}.
    Provide detailed feedback and learning suggestions for each topic they struggled with (e.g., closures, promises, etc.).
    Suggest YouTube links, articles, or tutorials for learning these concepts.
  `;
};
const callGeminiAPI = async (gptPrompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: gptPrompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No feedback generated.";
    return generatedText;
  } catch (error) {
    console.error(
      "💔 Gemini API Error:",
      error.response?.data || error.message
    );
    return null;
  }
};


// 🧾 Calculate quiz score & check answers
const calculateScore = (questions, userAnswers) => {
  let score = 0;
  const detailedResults = questions.map((question, index) => {
    const isCorrect =
      question.correctAnswer.toLowerCase().trim() ===
      userAnswers[index].toLowerCase().trim();
    if (isCorrect) score++;
    return {
      question: question.question,
      isCorrect,
      userAnswer: userAnswers[index],
    };
  });

  return { score, total: questions.length, detailedResults };
};

// 🧾 Submit quiz and get feedback from Gemini
// 🧾 Submit quiz and get feedback from Gemini
export const submitQuizWithFeedback = async (req, res) => {
  try {
    const { userId, questions, userAnswers, topic } = req.body;

    // 1️⃣ Validate input
    if (!userId || !questions || !userAnswers || !topic) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (userId, topic, questions, userAnswers) are required",
      });
    }

    // 2️⃣ Calculate score
    const { score, total, detailedResults } = calculateScore(
      questions,
      userAnswers
    );

    // 3️⃣ Find wrong answers
    const wrongAnswers = detailedResults.filter((result) => !result.isCorrect);

    // 4️⃣ Prepare Gemini prompt
    const gptPrompt = prepareGeminiPrompt(score, total, wrongAnswers, topic);

    // 5️⃣ Get feedback from Gemini API
    const gptFeedback = await callGeminiAPI(gptPrompt); // Pass the prompt to Gemini API

    // Check if we got feedback from Gemini
    if (!gptFeedback) {
      return res.status(500).json({
        success: false,
        message: "Error getting feedback from Gemini API",
      });
    }

    // 6️⃣ Store quiz attempt in DB
    const attempt = await QuizAttempt.create({
      user: new mongoose.Types.ObjectId(userId),
      topic,
      questions,
      userAnswers,
      score,
      total,
      timestamp: new Date(),
    });

    // 7️⃣ Send success response with feedback
    return res.status(200).json({
      success: true,
      message: "Quiz submitted and feedback generated successfully",
      score,
      total,
      attemptId: attempt._id,
      feedback: gptFeedback, // Send Gemini feedback
      detailedResults,
    });
  } catch (error) {
    // Log the error for easier debugging
    console.error("❌ Quiz Submission & Gemini Feedback Error:", error.message);

    // Send a structured error response
    res.status(500).json({
      success: false,
      message: "Quiz submission and feedback generation failed",
      error: error.message || "Internal Server Error",
    });
  }
};
