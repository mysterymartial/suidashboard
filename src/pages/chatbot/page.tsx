import { Layout } from "../../components/layout/Layout";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const SuiBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your SUI blockchain assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://suidashboard.onrender.com/api/v1/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userMessage.content,
            api_key: import.meta.env.VITE_CHAT_API_KEY,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        console.log(response);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.response ||
          data.message ||
          "I received your message but couldn't process it properly.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      console.log(botMessage);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        "Failed to send message. Please check your API key and try again.",
      );

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your SUI blockchain assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="">
                  <Bot className="w-6 h-6 text-[#292929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#292929]">
                    SUI AI Assistant
                  </h1>
                  <p className="text-[#292929]">
                    Ask me anything about the SUI blockchain
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="px-4 py-2 text-sm text-[#292929] hover:text-[#292929] border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Chat Container */}
          <div className="bg-[#cdcdcd] rounded-lg border border-gray-700 flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.sender === "user"
                          ? "bg-[#292929]"
                          : "bg-[#fff]"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-[#fff]" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#292929]" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-[#292929] text-[#fff]"
                          : "bg-[#fff] text-[#292929]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-[#292929]"
                            : "text-[#292929]"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="p-2 rounded-full bg-[#fff]">
                      <Bot className="w-4 h-4 text-[#292929]" />
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-[#fff] text-[#292929]">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about SUI blockchain..."
                    className="w-full px-4 py-3 bg-[#fff] border border-gray-600 rounded-lg text-[#292929] placeholder-gray-400 resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-1 bg-[#292929] text-[#292929] rounded-lg disabled:bg-[#cdcdcd] disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              <p className="text-xs text-[#292929] mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuiBot;
