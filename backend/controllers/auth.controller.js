import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET;

// Register
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const threadID = uuidv4();

    const user = await User.create({ username, email, password: passwordHash, threadID });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("Incoming registration:", req.body);
    return res.status(201).json({
      token,
      threadID,
      user: { name: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error, please try again." });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      token,
      threadID: user.threadID || null,
      user: { name: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error, please try again." });
  }
};