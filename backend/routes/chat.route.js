import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();
router.post("/", verifyToken, handleChat);


export default router;