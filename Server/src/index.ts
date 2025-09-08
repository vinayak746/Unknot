import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// This is our new V2 endpoint that handles conversations
app.post("/api/advice", async (req: Request, res: Response) => {
  // 1. We now expect a 'messages' array from the frontend
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // 2. We create a system prompt to instruct the AI
  const systemPrompt = `
    You are Unknot, a senior friendship counselor. Your job is to analyze the user's situation, give kind but clear advice, and help the user. 
    Offer both emotional insight and actionable next steps. Respond in a warm, understanding tone. Use Markdown for formatting.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      // 3. We combine the system prompt with the user's message history
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages, // Pass the entire conversation history
      ],
      model: "llama-3.1-8b-instant",
    });

    const answer =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";
    res.json({ answer });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

// A simple health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.send("The Unknot server is running perfectly!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
