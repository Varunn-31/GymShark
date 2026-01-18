import React, { useState, useRef, useEffect } from "react";
import { getAICoachResponse } from "../utils/groqApi";

const AICoach = ({ exerciseContext = null }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI fitness coach. Ask me anything about exercises, nutrition, or fitness tips.'
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await getAICoachResponse(userMessage, exerciseContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = error.message || 'Unknown error occurred';
      
      // Provide more helpful error messages
      let userFriendlyMessage = 'Sorry, I encountered an error. ';
      if (errorMessage.includes('API key') || errorMessage.includes('Invalid')) {
        userFriendlyMessage += 'Please check your API key in the .env file and restart the server.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
        userFriendlyMessage += 'Please check your internet connection and try again.';
      } else if (errorMessage.includes('All AI models failed')) {
        userFriendlyMessage += 'The AI service is temporarily unavailable. Please try again in a moment.';
      } else {
        userFriendlyMessage += errorMessage;
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: userFriendlyMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (content) => {
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const withHeadings = escaped
      .replace(/^### (.*)$/gm, '<h4>$1</h4>')
      .replace(/^## (.*)$/gm, '<h3>$1</h3>')
      .replace(/^# (.*)$/gm, '<h2>$1</h2>');

    const withBold = withHeadings.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const withLineBreaks = withBold.replace(/\n/g, '<br />');

    return { __html: withLineBreaks };
  };

  return (
    <div className="p-6 rounded-2xl bg-white/45 border border-white/60 backdrop-blur-xl text-gray-900 h-[600px] flex flex-col mb-6 shadow-2xl">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-white/60 mr-3 flex items-center justify-center border border-white/60">
          <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">AI Fitness Coach</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white/40 rounded-xl border border-white/60 scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-black/5">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-amber-300/20 text-gray-900 border border-amber-400/30'
                    : 'bg-white/55 text-gray-900 border border-white/60'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="break-words coach-markdown" dangerouslySetInnerHTML={renderMarkdown(message.content)} />
                ) : (
                  <p className="break-words">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl bg-white/55 border border-white/60">
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask your fitness coach..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1 bg-white/55 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 border border-white/60"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="min-w-[60px] bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-xl px-4 py-3 hover:from-amber-300 hover:to-orange-400 transition-all duration-300 disabled:bg-white/50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AICoach;
