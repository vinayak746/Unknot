import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL, // This will be http://localhost:5173 during dev
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/advice", async (req, res) => {
  const { answers } = req.body;

  const prompt = `
    You are a senior friendship counselor. A user has answered questions to resolve a misunderstanding. 
    Your job is to analyze the situation, give kind but clear advice, and help the user. 
    Offer both emotional insight and a next step. Respond in a warm, understanding tone. Use Markdown for formatting.
    
    Here are the user's answers:
    - How close are we? ${answers.closeness}
    - How am I feeling? ${answers.feeling}
    - What do I want? ${answers.intent}
    - What would I say? "${answers.message}"
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: "Please provide your advice based on my answers.",
        },
      ],
      model: "llama-3.1-8b-instant", // Or 'llama3-70b-8192' for a more powerful model
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
// Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// app.post("/api/advice", async (req, res) => {
//   const { answers } = req.body;

//   const prompt = `
// You are a senior friendship counselor. A user has answered the following questions to help resolve a misunderstanding with their friend.

// Your job is to analyze the situation carefully, give kind but clear advice, and help the user understand what's really going on. Think deeply, like someone who's seen hundreds of friendships rise and fall. Offer both emotional insight and a next step they can take.

// User's answers:
// ${JSON.stringify(answers, null, 2)}

// Respond with your thoughtful advice in a warm and understanding tone.
// `;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const answer = response.text();

//     res.json({ answer });
//   } catch (error) {
//     console.error("Gemini Error:", error); // <-- This will now show the full error
//     res.status(500).json({ error: "Gemini failed to respond" });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
