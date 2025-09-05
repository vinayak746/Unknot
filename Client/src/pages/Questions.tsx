import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import axios

// The AnswerData interface is perfect as is.
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

  // 2. Add loading and error states for a better user experience
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // 3. This function will now handle the API call
  const getAdviceAndNavigate = async () => {
    setIsLoading(true);
    setError(null);

    // This is a crucial step: We combine the user's answers into a single,
    // coherent prompt for the AI. This gives Gemini the full context.

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

    try {
      const response = await axios.post(`${backendUrl}/api/advice`, {
        answers: answers,
        // We can add MBTI fields back here later if we want
      });

      // On success, navigate to the result page with the AI's advice
      navigate("/result", { state: { advice: response.data.answer } });
    } catch (err) {
      console.error("Error fetching advice:", err);
      setError("Sorry, we hit a snag. Please try again in a moment.");
      setIsLoading(false); // Stop loading on error
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // 4. On the final step, call our new API function instead of navigating directly
      getAdviceAndNavigate();
    }
  };

  const updateAnswer = (field: keyof AnswerData, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const questions = [
    // Your questions array is perfect, no changes needed here.
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

  // 5. If it's loading, we can show a loading screen to the user
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-pink-100 to-purple-200 px-6">
        <h2 className="text-2xl font-semibold text-purple-700">
          Unknotting the problem...
        </h2>
        <p className="text-purple-600 mt-2">
          Our counselor is thinking deeply.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 to-purple-200 px-6 py-10 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          {current.label}
        </h2>

        {/* The rest of your JSX is great. We just need to add the error display */}
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
            See My Result
          </button>
        )}

        {/* 6. Display the error message if something goes wrong */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
