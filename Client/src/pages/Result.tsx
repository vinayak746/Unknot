// FILE: client/src/pages/Result.tsx

import { useLocation, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const Result = () => {
  // This hook gives us information about the current page, including the state
  const location = useLocation();

  // We safely access the 'advice' we passed from the Questions page.
  // The '?' prevents an error if location.state is null.
  const advice = location.state?.advice;

  // This is a fallback for if someone navigates to /result directly
  if (!advice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-pink-100 to-purple-200 text-center px-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-purple-700 mb-4">
            No Advice Found
          </h1>
          <p className="text-gray-600 mb-6">
            Please go back to the questions page and describe your situation
            first.
          </p>
          <Link
            to="/questions"
            className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 to-purple-200 px-6 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-left">
        <h1 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
          Here's some guidance
        </h1>
        <div className="prose lg:prose-xl max-w-none">
          {/* ReactMarkdown renders the formatted response from the AI beautifully */}
          <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/questions"
            className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          >
            Ask Another Question
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
