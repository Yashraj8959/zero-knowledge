import express from "express";
import * as UserController from "../Controller/user.controller.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
 
export default router;