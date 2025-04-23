import express from "express";
import { generateQuizFromGemini } from "../Controller/GeminiController.js";

const router = express.Router();

router.post("/generate", generateQuizFromGemini);

export default router;