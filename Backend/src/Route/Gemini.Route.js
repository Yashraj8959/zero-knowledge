import express from "express";
import { generateQuizFromGemini } from "../Controller/GeminiController.js";
import { getRoadmap } from "../Controller/RoadmapController.js";
import { getResumeSuggestions } from "../Controller/ResumeController.js";

const router = express.Router();

router.post("/generate", generateQuizFromGemini);
router.post("/Roadmap" , getRoadmap)
router.post("/resume",getResumeSuggestions) 
export default router;