// FILE: client/src/pages/Chat.tsx

import { useState, type FormEvent, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMbti, setUserMbti] = useState("");
  const [friendMbti, setFriendMbti] = useState("");

  const location = useLocation();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // This effect runs only once when the component loads
  useEffect(() => {
    // Gracefully handle the state from the previous page
    const {
      initialMessage,
      userMbti: newUserMbti,
      friendMbti: newFriendMbti,
    } = location.state || {};

    // --- THIS IS THE FIX ---
    // Always set the state. If the new value from location.state is undefined or null,
    // it will default to an empty string. This explicitly clears out old values.
    setUserMbti(newUserMbti || "");
    setFriendMbti(newFriendMbti || "");
    // ----------------------

    if (initialMessage) {
      const firstMessage: Message = { role: "user", content: initialMessage };
      setMessages([firstMessage]);
      // Pass the new, cleaned values to the first API call
      fetchAdvice([firstMessage], newUserMbti, newFriendMbti);
    } else {
      setMessages([
        {
          role: "assistant",
          content: "Hello! How can I help you with your friendship today?",
        },
      ]);
    }
  }, [location.state]); // This effect re-runs whenever we navigate to this page with new state

  // This effect scrolls to the bottom of the chat whenever a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAdvice = async (
    currentMessages: Message[],
    currentUserMbti?: string,
    currentFriendMbti?: string
  ) => {
    setIsLoading(true);
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await axios.post(`${backendUrl}/api/advice`, {
        messages: currentMessages,
        userMbti: currentUserMbti,
        friendMbti: currentFriendMbti,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching advice:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmedInput };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    fetchAdvice(newMessages, userMbti, friendMbti);
  };

  // --- No changes needed in the JSX below ---
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4 text-center shadow-md">
        <h1 className="text-xl font-semibold">Unknot Counselor</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-2xl shadow ${
                message.role === "user"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-lg px-4 py-2 rounded-2xl shadow bg-white text-gray-800">
              <span className="animate-pulse">● ● ●</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isLoading ? "Waiting for response..." : "Type your message..."
            }
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition disabled:bg-purple-300"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
