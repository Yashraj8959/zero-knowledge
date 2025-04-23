import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import connectDB from "./DataBase/Db.js";
import userRoutes from "./Route/User.route.js"; 
import geminiRoutes from "./Route/Gemini.Route.js";
import quizRoutes from "./Route/QuizRoute.js";
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/quiz", quizRoutes);


export default app;
