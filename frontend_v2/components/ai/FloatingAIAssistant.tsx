"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Label } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hello Dr. Vikram. I am your offline clinical assistant. Ask me about drug dosages, emergency guidelines, or rural triage protocols.",
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
      let reply =
        "Based on offline clinical protocols: Please verify patient vitals and check for red flags like crushing chest pain or hypoxia.";
      const lower = userText.toLowerCase();
      if (lower.includes("aspirin") || lower.includes("dosage")) {
        reply =
          "Aspirin Acute ACS Dosage Protocol: 325mg non-enteric coated chewable tablet STAT. Avoid if active GI bleed history.";
      } else if (lower.includes("fever") || lower.includes("temp")) {
        reply =
          "Rural Fever Protocol: Assess for rigors, cough, and rash. If Temp above 38.5C with WBC above 12k, initiate empirical antibiotic review.";
      } else if (lower.includes("snake") || lower.includes("bite")) {
        reply =
          "EMERGENCY SNAKE BITE INTERCEPT: Keep patient calm, immobilize limb. Do NOT apply tourniquet. Transfer to referral center for ASV.";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-[2px] bg-surface border border-rule overflow-hidden flex flex-col h-[420px] shadow-lg">
          {/* Drawer header */}
          <div className="p-3 bg-surface-raised border-b border-rule flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="h-5 w-5 text-action shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="text-h3 text-ink truncate font-mono text-[13px] font-bold uppercase">Offline Clinical Assistant</h2>
                <Label className="font-mono text-[10px]">Gemma 3 4B, local edge</Label>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-[2px] text-ink-muted hover:text-ink hover:bg-surface transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              aria-label="Close clinical assistant"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-ground/50 text-[13px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "p-2.5 rounded-[2px] border text-body-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-action-subtle text-action border-action/30 ml-6"
                    : "bg-surface text-ink border-rule mr-6 font-mono text-[12px]"
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Prompt input */}
          <form onSubmit={handleSend} className="p-2 border-t border-rule bg-surface flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query protocol or drug..."
              className="flex-1 h-9 px-3 text-[13px] bg-ground border border-rule rounded-[2px] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus font-mono"
            />
            <button
              type="submit"
              className="h-9 w-9 inline-flex items-center justify-center rounded-[2px] bg-action text-on-action hover:bg-action-hover active:bg-action-active transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              aria-label="Send question"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 h-9 px-3.5 rounded-[2px] bg-surface border border-rule-strong text-ink hover:bg-surface-raised transition-colors font-mono font-semibold text-[12px] uppercase shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <MessageSquare className="h-3.5 w-3.5 text-action shrink-0" aria-hidden="true" />
        <span>Clinical Co-Pilot</span>
      </button>
    </div>
  );
}
