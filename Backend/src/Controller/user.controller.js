import User from "../Modal/User.Modal.js";
import createHttpError from "http-errors";

// Utils for response & async error handling
const handleServerError = (res, error, message = "Internal Server Error") => {
  console.error("❌ Server Error:", error);
  return res.status(500).json({ success: false, message });
};

// 📌 Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🛑 Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 🔍 Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" }); // 409 = Conflict
    }

    // 🔐 Hash the password
    const hashedPassword = await User.generateHashPassword(password);
    if (!hashedPassword) {
      return handleServerError(res, null, "Error hashing password");
    }

    // 📦 Create and save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // 🔐 Token generation
    const token = await user.generateAuthToken();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    return handleServerError(res, error);
  }
};

// 📌 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🛑 Basic input check
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 🔍 Get user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" }); // 401 = Unauthorized
    }

    // ✅ Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 🔐 Generate token
    const token = await user.generateAuthToken();
    if (!token) {
      return handleServerError(res, null, "Failed to generate token");
    }

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};
