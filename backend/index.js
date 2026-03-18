import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
/* global process */
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

// ChatGPT GenAI API endpoint

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const maxToken = 150;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ChatGPT Response
    const data = {
      model: "gpt-3.5-turbo",
      message: [{ role: "user", content: message }],
      max_tokens: maxToken,
    };
    const header = {
      Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
      "Content-Type": "application/json",
    };
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    console.log(resData);
    // res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
