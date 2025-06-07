"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");

    try {
      setIsTyping(true);

      const response = await fetch("http://localhost:8080/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setIsTyping(false);
        return;
      }

      const data = await response.json();

      if (data.answer) {
        setMessages((prev) => [...prev, { from: "bot", text: data.answer }]);
      } else {
        console.error("No answer in response:", data);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Botón flotante en esquina inferior derecha */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setOpen(true)}
            className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 text-2xl"
          >
            <span role="img" aria-label="chat">
              💬
            </span>
          </button>
        </div>
      )}

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 flex flex-col w-96 h-[500px] rounded-xl bg-white shadow-xl border border-gray-200 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl shadow-sm">
            <span className="text-lg font-semibold">Asistente Virtual</span>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl leading-none hover:text-gray-200 transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${
                  m.from === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {m.text}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                <span className="text-gray-500 text-xs ml-2">
                  Escribiendo...
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center px-3 py-2 border-t bg-white">
            <input
              type="text"
              className="flex-1 px-4 py-2 text-gray-800 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
