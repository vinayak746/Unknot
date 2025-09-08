// FILE: client/src/pages/Questions.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Interface remains the same - perfect.
interface AnswerData {
  closeness: string;
  feeling: string;
  intent: string;
  userMbti: string;
  friendMbti: string;
  message: string;
}

export default function Questions() {
  const [step, setStep] = useState(0);

  // FIX #1: Simplified State. We removed the extra userMbti and friendMbti states.
  // The 'answers' object is our single source of truth.
  const [answers, setAnswers] = useState<AnswerData>({
    closeness: "",
    feeling: "",
    intent: "",
    userMbti: "",
    friendMbti: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Add our console.log for debugging!
    console.log("Submitting these answers:", answers);

    const startingMessage = `
      Here's my situation:
      - How close we are: ${answers.closeness}
      - How I'm feeling: ${answers.feeling}
      - What I want to achieve: ${answers.intent}
      - What I would say to them: "${answers.message}"
    `;

    navigate("/chat", {
      state: {
        initialMessage: startingMessage,
        userMbti: answers.userMbti,
        friendMbti: answers.friendMbti,
      },
    });
  };

  const handleNext = () => {
    if (step < 5) {
      // We have 6 questions (0-5)
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const updateAnswer = (field: keyof AnswerData, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const questions = [
    {
      label: "How close are you with this person?",
      options: ["Best Friend", "Close Friend", "Just Friends", "Acquaintance"],
      field: "closeness" as const,
    },
    {
      label: "What emotion are you feeling most?",
      options: ["Hurt", "Confused", "Ignored", "Guilty", "Angry"],
      field: "feeling" as const,
    },
    {
      label: "What do you want right now?",
      options: ["Fix things", "Take a break", "Let it go"],
      field: "intent" as const,
    },
    // FIX #2: Removed the conflicting 'textarea: true' from MBTI questions
    {
      label: "What's your MBTI type? (optional)",
      textInput: true,
      field: "userMbti" as const,
      placeholder: "e.g., INFP",
    },
    {
      label: "What's your friend's MBTI type? (optional)",
      textInput: true,
      field: "friendMbti" as const,
      placeholder: "e.g., ESTJ",
    },
    {
      label: "If they were in front of you, what would you say?",
      textarea: true,
      field: "message" as const,
      placeholder: "Type what your heart feels...",
    },
  ];

  const current = questions[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 to-purple-200 px-6 py-10 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          {current.label}
        </h2>

        {/* --- FIX #3: ADDED THE MISSING LOGIC FOR 'textInput' --- */}

        {/* This part handles the buttons (options) */}
        {"options" in current && (
          <div className="space-y-3">
            {current.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  updateAnswer(current.field, option);
                  handleNext();
                }}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* This part handles the final big textarea */}
        {"textarea" in current && current.textarea && (
          <>
            <textarea
              rows={4}
              value={answers.message}
              onChange={(e) => updateAnswer(current.field, e.target.value)}
              className="w-full border border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              placeholder={current.placeholder}
            />
            <button
              onClick={handleNext}
              disabled={!answers.message.trim()}
              className="mt-6 px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
            >
              Start Conversation
            </button>
          </>
        )}

        {/* THIS IS THE NEW PART THAT RENDERS THE MBTI INPUTS */}
        {"textInput" in current && current.textInput && (
          <>
            <input
              type="text"
              value={answers[current.field as keyof AnswerData]}
              onChange={(e) =>
                updateAnswer(current.field, e.target.value.toUpperCase())
              }
              className="w-full border border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
              placeholder={current.placeholder}
              maxLength={4}
            />
            <button
              onClick={handleNext}
              className="mt-6 px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
