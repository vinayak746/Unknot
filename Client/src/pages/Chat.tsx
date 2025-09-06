import { useState, type FormEvent } from "react";

// We define a type for what a single message object should look like
interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  // === 1. THE STATE ===
  // The 'messages' array holds the entire conversation history.
  // We'll start it with a friendly greeting from the assistant.
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Tell me about the situation with your friend. What's on your mind?",
    },
  ]);

  // The 'input' string holds the text currently being typed in the input box.
  const [input, setInput] = useState("");

  // === 2. THE LOGIC ===
  // This function is called when the user submits the form (hits 'Send').
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the browser from reloading the page

    // Don't send empty messages
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add the user's new message to our messages array
    const userMessage: Message = { role: "user", content: trimmedInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear the input box for the next message
    setInput("");

    // --- TODO: LATER WE WILL CALL THE BACKEND API HERE ---
  };

  // === 3. THE JSX (The UI) ===
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Header Bar */}
      <header className="bg-purple-600 text-white p-4 text-center shadow-md">
        <h1 className="text-xl font-semibold">Unknot Counselor</h1>
      </header>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            // This logic aligns user messages to the right and assistant messages to the left
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              // This logic gives different colors to user and assistant messages
              className={`max-w-lg px-4 py-2 rounded-2xl shadow ${
                message.role === "user"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
