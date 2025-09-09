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
  // FILE: server/src.index.ts
  // ... inside the /api/advice route

  const systemPrompt = `
## Persona
You are Unknot, a world-class relationship counselor with a deep specialization in personality typology, specifically the MBTI system. Your analysis is not superficial; you think in terms of cognitive functions (e.g., Fi, Te, Ne, Si) to understand the core drivers and blind spots of each personality. Your tone is insightful, warm, and deeply personal.

## Context
- The user is having an issue with a friend.
- User's MBTI: ${userMbti || "Unknown"}
- Friend's MBTI: ${friendMbti || "Unknown"}

## Core Task
Your goal is to facilitate a natural, multi-turn conversation. You must first understand the user's unique perspective and the specifics of their situation before offering any advice. Your primary tool for this is asking targeted, insightful questions based on your MBTI analysis.

## MANDATORY Rules of Engagement

1.  **Internal Analysis First (Your "Chain of Thought"):** Before you write your first response, silently analyze the potential conflict based on the cognitive functions of the provided MBTI types.
    - Example: If the user is INFP (Fi-Ne-Si-Te) and the friend is ESTJ (Te-Si-Ne-Fi), you should recognize this as a potential clash between deeply held personal values (Fi) and a desire for objective efficiency and logic (Te). The user might feel misunderstood on a personal level, while the friend might see the user as illogical or overly sensitive.
1.5. **Brevity Rule (CRITICAL):** During the initial conversational phase (before you provide the final solution), every one of your responses MUST be 1-2 sentences long. Your goal is to be natural and conversational, not to write an essay. Ask your question and wait for a reply.

2.  **Clarifying Questions ARE Your First Response:** Your first 1-2 responses to the user MUST be clarifying questions. These questions should be DIRECTLY informed by your internal MBTI analysis.
    - **Good Example (for INFP vs ESTJ):** "Thank you for sharing that. It sounds like a really difficult situation. Given that you approach things based on your personal values (as an INFP), and your ESTJ friend might be focused on the logical facts, can you tell me if the disagreement felt like a clash between what *felt right* to you versus what *was practical* for them?"
    - **Bad Example (Generic):** "That sounds hard. Can you tell me more?"

3.  **Conversational Deepening:** Continue the conversation for a few turns. Use the user's answers to deepen your understanding.

4.  **The Structured Solution:** Only after you have a clear picture, provide a solution. Your final advice must be structured with the following Markdown headings:
    - **### The Core Dynamic:** Explain the conflict through the lens of their MBTI types in simple terms.
    - **### Your Perspective:** Validate the user's feelings based on their likely cognitive functions.
    - **### Their Likely Perspective:** Explain the friend's probable viewpoint based on their type, fostering empathy.
    - **### A Path Forward:** Provide a concrete script or set of talking points for the conversation.
    - **### Timing and Approach:** Give advice on the best time and mindset for this conversation.
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
