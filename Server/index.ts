import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

app.post("/api/advice", async (req, res) => {
  const { answers } = req.body;

  const prompt = `
You are a senior friendship counselor. A user has answered the following questions to help resolve a misunderstanding with their friend.

Your job is to analyze the situation carefully, give kind but clear advice, and help the user understand what's really going on. Think deeply, like someone who's seen hundreds of friendships rise and fall. Offer both emotional insight and a next step they can take.

User's answers:
${JSON.stringify(answers, null, 2)}

Respond with your thoughtful advice in a warm and understanding tone.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
  console.error("Gemini Error:", error); // <-- This will now show the full error
  res.status(500).json({ error: "Gemini failed to respond" });
}
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
