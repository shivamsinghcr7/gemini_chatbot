import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

/* global process */
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
const app = express();
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://gemini-chatbot-gamma-swart.vercel.app/",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

// Google GenAI API endpoint
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Gemini Response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });
    // console.log(res.text);
    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
