"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  FileText,
  User,
  RotateCcw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  source?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    text: "Ask about triage steps, red flags, first-aid protocols and what to document. Every question passes the emergency gate first; if it matches, you get the referral instruction and no model is consulted. Doses come from the facility formulary and are confirmed by the clinician, not by this assistant.",
    time: "10:00 AM",
    source: "MediGem",
  },
];

const SUGGESTED_PROMPTS = [
  {
    title: "Fever: what to assess and when to refer",
    prompt: "A child has had fever for three days. What should I assess, and which findings mean referral?",
    icon: FileText,
  },
  {
    title: "Chest pain: immediate steps before transfer",
    prompt: "Adult with chest tightness and breathlessness for 30 minutes. What do I do first?",
    icon: Activity,
  },
  {
    title: "Raised blood pressure with headache",
    prompt: "A 62-year-old woman has BP 150/90 and an occipital headache. What are the next steps?",
    icon: AlertTriangle,
  },
  {
    title: "Snakebite first aid at a sub-centre",
    prompt: "Suspected venomous snakebite at a sub-centre with no ICU. What is the first-aid protocol?",
    icon: ShieldCheck,
  },
];

function InlineFormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

function FormattedMessage({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");

  return (
    <div className="space-y-2 text-body-sm leading-relaxed">
      {paragraphs.map((para, i) => {
        const lines = para.split("\n");
        const isList = lines.length > 1 && lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "");

        if (isList) {
          return (
            <ol key={i} className="list-decimal list-inside space-y-1 pl-1">
              {lines
                .filter((l) => l.trim())
                .map((line, li) => {
                  const content = line.replace(/^\d+\.\s*/, "");
                  return (
                    <li key={li}>
                      <InlineFormattedText text={content} />
                    </li>
                  );
                })}
            </ol>
          );
        }

        return (
          <p key={i}>
            <InlineFormattedText text={para} />
          </p>
        );
      })}
    </div>
  );
}

export default function ClinicalAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [engineInfo, setEngineInfo] = useState<{
    ollamaOnline: boolean;
    provider: string;
  }>({
    ollamaOnline: false,
    provider: "Reference text only",
  });
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/assistant")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEngineInfo({
            ollamaOnline: !!data.ollamaOnline,
            provider: data.provider || (data.ollamaOnline ? "Local model" : "Reference text only"),
          });
        }
      })
      .catch(() => {});
  }, []);

  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInputQuery("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: data.source || (data.provider === "ollama" ? "Local model via Ollama" : "Reference text. No model was consulted."),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      console.error("Clinical Assistant fetch error:", err);
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: "The assistant could not be reached and no answer was generated. Use the facility protocol and refer if any red flag is present.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "No answer generated",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto h-[calc(100vh-8.5rem)] flex flex-col space-y-3.5 pb-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-rule pb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-action/10 text-action flex items-center justify-center border border-action/20 shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Clinical Assistant</h1>
              <span className="px-2.5 py-0.5 rounded-full text-body-sm font-semibold bg-risk-low/10 text-risk-low border border-risk-low/20 inline-flex items-center gap-1.5 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-risk-low" />
                {engineInfo.ollamaOnline ? "Local model available" : "Reference text only"}
              </span>
            </div>
            <p className="text-body-sm text-ink-muted mt-1">
              Protocol lookup and triage support. It does not diagnose or prescribe; the clinician decides.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule text-body-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-raised transition-colors shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Conversation</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="shrink-0 space-y-1.5">
          <span className="text-body-sm font-semibold text-ink-muted uppercase tracking-wider block">
            Quick Protocol Intercepts
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SUGGESTED_PROMPTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleSendMessage(item.prompt)}
                  className="p-2.5 text-left rounded-lg border border-rule bg-surface hover:border-action/40 hover:bg-surface-raised transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-action mb-0.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-body-sm font-bold text-ink truncate group-hover:text-action transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-body-sm text-ink-muted line-clamp-1 leading-normal">
                    {item.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Feed Container */}
        <div className="border border-rule rounded-xl bg-surface flex-1 min-h-0 flex flex-col overflow-hidden">
          <div ref={chatListRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[88%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-body-sm font-bold ${
                      isUser
                        ? "bg-action text-on-action"
                        : "bg-surface-raised text-action border border-rule"
                    }`}
                  >
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  </div>

                  <div className="space-y-1 max-w-full min-w-0">
                    <div
                      className={`p-3.5 rounded-2xl ${
                        isUser
                          ? "bg-action text-on-action rounded-tr-none text-body-sm leading-relaxed"
                          : "bg-surface-raised border border-rule text-ink rounded-tl-none"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      ) : (
                        <FormattedMessage text={m.text} />
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-2 text-body-sm text-ink-muted px-1 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>{m.time}</span>
                      {m.source && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-action/80 truncate max-w-xs">
                            {m.source}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex gap-3 max-w-[88%]">
                <div className="h-7 w-7 rounded-full bg-surface-raised text-action border border-rule flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-action" />
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-surface-raised border border-rule text-body-sm text-ink-muted flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-action animate-ping" />
                  <span>Consulting offline edge clinical database...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 border-t border-rule bg-surface-raised/40 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about triage steps, red flags, or a protocol..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 text-body-sm bg-surface border border-rule rounded-lg text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-action focus:border-action transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-4 py-2 bg-action hover:bg-action-hover disabled:opacity-50 disabled:cursor-not-allowed text-on-action font-semibold text-body-sm rounded-lg inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

