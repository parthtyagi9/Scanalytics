"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    experimental_throttle: 50,
  });

  // Scroll logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-white font-mono overflow-hidden">
      {/* Sidebar - FIXED HEIGHT IS KEY */}
      <aside className="w-[400px] h-screen border-r-2 border-secondary flex flex-col bg-card/50">
        {/* 1. Header: Fixed height */}
        <div className="h-16 shrink-0 p-4 border-b-2 border-secondary flex items-center justify-between bg-card">
          <span className="text-base font-bold uppercase tracking-widest">
            Chat
          </span>
          <Button variant="ghost" size="icon" onClick={() => setMessages([])}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* 2. ScrollArea: flex-1 AND min-h-0 prevents the "pushing" behavior */}
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="p-4 space-y-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-2 ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-4 border-2 max-w-[90%] text-sm ${
                    m.role === "user"
                      ? "bg-secondary text-white border-secondary"
                      : "bg-card border-secondary"
                  }`}
                >
                  {m.parts.map(
                    (p, i) => p.type === "text" && <p key={i}>{p.text}</p>
                  )}
                </div>
              </div>
            ))}
            {/* The Invisible Anchor */}
            <div ref={bottomRef} className="h-1" />
          </div>
        </ScrollArea>

        {/* 3. Input: shrink-0 ensures it stays at the bottom */}
        <div className="shrink-0 p-4 border-t-2 border-secondary bg-card">
          <form onSubmit={handleSubmit} className="relative group">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Execute command..."
              className="bg-background border-2 border-secondary h-12"
            />
            <Button
              type="submit"
              className="absolute right-0 top-0 bottom-0 h-12 w-12"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-[#0a0a0a]">{/* Workspace content */}</main>
    </div>
  );
}
