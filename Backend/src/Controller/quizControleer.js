import axios from "axios";
import mongoose from "mongoose";
import QuizAttempt from "../Modal/QuizModel.js"; // Assuming the QuizAttempt model is set correctly
import User from "../Modal/User.Modal.js";

// 🧠 Prepare Gemini 2.5 prompt for feedback
const prepareGeminiPrompt = (score, total, wrongAnswers, topic) => {
  const wrongQuestionsText = wrongAnswers.map((q) => q.question).join(", ");
  return `
      User got ${score}/${total} in ${topic}.
      Wrong answers were on: ${wrongQuestionsText}.
      Provide detailed feedback and learning suggestions for each topic they struggled with (e.g., closures, promises, etc.).
      Suggest YouTube links, articles, or tutorials for learning these concepts.
      Suggest a roadmap for improving their knowledge in ${topic} and related areas.
      Output the response in JSON format with keys: "feedback" and "resources".
      Add last line: "Do You want to retry the quiz?"
  `;
};

// 🧠 Call Gemini API to get feedback
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
  
      // Log the raw response for debugging
      console.log("Raw Gemini Response:", response.data);
  
      // Get the feedback from the response
      const feedback = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback generated.";
  
      // Log the feedback to check
      console.log("Gemini Feedback (Before Sending):", feedback);
  
      // Send the raw feedback as it is without parsing
      return { feedback: feedback, resources: [] };
    } catch (error) {
      console.error("💔 Gemini API Error:", error.response?.data || error.message);
      return { feedback: "Failed to get feedback from Gemini", resources: [] }; // Return fallback error
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
    const { score, total, detailedResults } = calculateScore(questions, userAnswers);

    // 3️⃣ Find wrong answers
    const wrongAnswers = detailedResults.filter((result) => !result.isCorrect);

    // 4️⃣ Prepare Gemini prompt
    const gptPrompt = prepareGeminiPrompt(score, total, wrongAnswers, topic);

    // 5️⃣ Get feedback from Gemini API
    const gptFeedback = await callGeminiAPI(gptPrompt); // Get structured feedback

    // Check if we got valid feedback
    if (!gptFeedback || !gptFeedback.feedback) {
      return res.status(500).json({
        success: false,
        message: "Error getting feedback from Gemini API",
      });
    }
const user = await User.findById(userId);
    // 6️⃣ Store quiz attempt in DB
    const attempt = await QuizAttempt.create({
      user: user._id,
      topic,
      questions,
      userAnswers,
      score,
      total,
      timestamp: new Date(),
    });

    // 7️⃣ Send success response with structured feedback
    return res.status(200).json({
      success: true,
      message: "Quiz submitted and feedback generated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      topic,
      score,
      total, 
      attemptId: attempt._id,
      feedback: gptFeedback.feedback,  
      resources: gptFeedback.resources, 
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

