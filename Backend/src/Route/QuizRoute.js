import express from "express";
import {  submitQuizWithFeedback } from "../Controller/quizControleer.js";

const router = express.Router();

// router.post("/submit", submitQuiz);
router.post("/submitWithFeedback", submitQuizWithFeedback);

export default router;