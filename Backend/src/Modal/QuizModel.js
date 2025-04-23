import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  questions: [{ question: String, options: [String], correctAnswer: String }],
  userAnswers: [String],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const QuizAttempt = mongoose.model("QuizAttempt", QuizAttemptSchema);

export default QuizAttempt;
