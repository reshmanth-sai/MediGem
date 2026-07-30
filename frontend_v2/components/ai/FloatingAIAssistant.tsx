"use client";

import React, { useState } from "react";
import { Brain, X, Send, Sparkles } from "lucide-react";

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hello Dr. Vikram! I am your offline Gemma 3 Clinical Assistant. Ask me about drug dosages, emergency guidelines, or rural triage protocols.",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setQuery("");

    // Simulated offline AI response
    setTimeout(() => {
      let reply = "Based on offline clinical protocols: Please verify patient vitals and check for red flags like crushing chest pain or hypoxia.";
      const lower = userText.toLowerCase();
      if (lower.includes("aspirin") || lower.includes("dosage")) {
        reply = "Aspirin Acute ACS Dosage Protocol: 325mg non-enteric coated chewable tablet STAT. Avoid if active GI bleed history.";
      } else if (lower.includes("fever") || lower.includes("temp")) {
        reply = "Rural Fever Protocol: Assess for rigors, cough, and rash. If Temp >38.5°C with WBC >12k, initiate empirical antibiotic review.";
      } else if (lower.includes("snake") || lower.includes("bite")) {
        reply = "EMERGENCY SNAKE BITE INTERCEPT: Keep patient calm, immobilize limb. Do NOT apply tourniquet. Transfer to referral center for ASV.";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Drawer Dialog with Ultra-Glassmorphism Backdrop Blur */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col h-[420px] animate-fadeIn">
          {/* Drawer Header */}
          <div className="p-3 bg-gradient-to-r from-slate-950/80 to-teal-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  Offline Clinical Assistant
                  <Sparkles className="h-3 w-3 text-teal-400" />
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Gemma 3 4B • Local Edge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-teal-500 text-slate-950 font-medium rounded-tr-none shadow-md"
                      : "bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex gap-1.5">
            <input
              type="text"
              placeholder="Ask offline clinical AI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold transition-all shadow-md"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Glassmorphism Floating Assistant Button with High Transparency & Crisp Blur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-xl border border-teal-500/40 hover:border-teal-400/80 text-teal-300 shadow-2xl shadow-teal-950/50 transition-all duration-300 hover:scale-105 font-bold text-xs"
        title="Ask Offline AI Clinical Assistant"
      >
        <Brain className="h-4 w-4 text-teal-400 animate-pulse" />
        <span className="tracking-wide">Ask AI Assistant</span>
      </button>
    </div>
  );
}
