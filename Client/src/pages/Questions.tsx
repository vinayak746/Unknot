import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AnswerData {
  closeness: string;
  feeling: string;
  intent: string;
  message: string;
}

export default function Questions() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerData>({
    closeness: "",
    feeling: "",
    intent: "",
    message: "",
  });

  const navigate = useNavigate();

  // This function runs on the final step. It no longer calls the API.
  // It just formats the initial message and passes it to the new /chat page.
  const handleSubmit = () => {
    const startingMessage = `
      Here's my situation:
      - How close we are: ${answers.closeness}
      - How I'm feeling: ${answers.feeling}
      - What I want to achieve: ${answers.intent}
      - What I would say to them: "${answers.message}"
    `;

    // Navigate to the chat page and pass the starting message in the state
    navigate("/chat", { state: { initialMessage: startingMessage } });
  };

  // This function controls moving between questions
  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // On the final step, we call handleSubmit
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
      field: "closeness",
    },
    {
      label: "What emotion are you feeling most?",
      options: ["Hurt", "Confused", "Ignored", "Guilty", "Angry"],
      field: "feeling",
    },
    {
      label: "What do you want right now?",
      options: ["Fix things", "Take a break", "Let it go"],
      field: "intent",
    },
    {
      label: "If they were in front of you, what would you say?",
      textarea: true,
      field: "message",
    },
  ];

  const current = questions[step];

  return (
    // Your JSX for the form remains the same. No changes needed here.
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 to-purple-200 px-6 py-10 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          {current.label}
        </h2>
        {current.textarea ? (
          <textarea
            rows={4}
            value={answers.message}
            onChange={(e) => updateAnswer("message", e.target.value)}
            className="w-full border border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            placeholder="Type what your heart feels..."
          />
        ) : (
          <div className="space-y-3">
            {current.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  updateAnswer(current.field as keyof AnswerData, option);
                  handleNext();
                }}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {current.textarea && (
          <button
            onClick={handleNext}
            disabled={!answers.message.trim()}
            className="mt-6 px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
          >
            Start Conversation
          </button>
        )}
      </div>
    </div>
  );
}
