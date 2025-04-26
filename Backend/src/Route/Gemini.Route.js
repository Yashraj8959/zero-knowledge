import express from "express";
import { generateQuizFromGemini } from "../Controller/GeminiController.js";
import { getRoadmap } from "../Controller/RoadmapController.js";

const router = express.Router();

router.post("/generate", generateQuizFromGemini);
router.post("/Roadmap" , getRoadmap)

export default router;