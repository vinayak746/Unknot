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
  const { messages, userMbti, friendMbti } = req.body;
  console.log("full request body recieved by the server", req.body);
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // 2. We create a system prompt to instruct the AI
  const systemPrompt = `
  You are Unknot, an expert friendship counselor. Your tone is warm, empathetic, and insightful.

  Your primary goal is to have a natural, multi-turn conversation to fully understand the user's situation before providing a solution. DO NOT give a full action plan until you have asked clarifying questions.

  Follow these conversational rules:

  1.  **First Response Rule:** When the user provides their initial problem, your first response should ONLY do two things:
      - Briefly acknowledge and validate their feelings (e.g., "That sounds really tough," or "It makes sense that you're feeling confused.").
      - Ask one or two clarifying questions to get more detail. (e.g., "Could you tell me a bit more about what led to this feeling?" or "Has something like this happened before?").
      - DO NOT provide any "next steps" or "solutions" in your first response.

  2.  **Conversational Rule:** For the next 2-3 messages, continue the conversation. Listen to the user's answers and ask more follow-up questions until you feel you have the complete picture. Keep your responses concise during this phase.

  3.  **Solution Rule:** Once you have a full understanding, tell the user, "Okay, I think I have a good sense of the situation now. Here are a few thoughts and suggestions." Then, and ONLY then, provide a structured action plan.

    4.  **MBTI Rule (MANDATORY):** The user's MBTI is ${
      userMbti || "Unknown"
    } and their friend's is ${
    friendMbti || "Unknown"
  }. If these types are NOT 'Unknown', your very first clarifying question MUST explicitly mention these types and how they might relate to the conflict. For example, start with something like, "Thanks for sharing that. As an INTP, you might be trying to find the logical root of the problem, while your ENFP friend might be focused on the emotional harmony of the situation. To help me understand the specifics, could you tell me...". This is not optional.

  Your final structured advice should be formatted with Markdown.
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
