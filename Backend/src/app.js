import express from "express";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from '@clerk/express'


const app = express();

app.use(clerkMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import connectDB from "./DataBase/Db.js";
import userRoutes from "./Route/User.route.js";
connectDB();

app.use("/api/user", userRoutes);

export default app;
