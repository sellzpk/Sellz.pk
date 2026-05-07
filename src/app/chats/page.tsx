"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Send, ArrowLeft, Flag, MoreVertical } from "lucide-react";
import Link from "next/link";

const CONVERSATIONS = [
  { id: "1", seller: "Abdul Rehman", adTitle: "iPhone 15 Pro Max 256GB", lastMsg: "Is this still available?", time: "2m ago", unread: 2, verified: true },
  { id: "2", seller: "Bilal Ahmed", adTitle: "Toyota Corolla 2020", lastMsg: "What's the final price?", time: "1h ago", unread: 0, verified: true },
  { id: "3", seller: "Sana Malik", adTitle: "Dell XPS 15 Laptop", lastMsg: "I can meet tomorrow.", time: "Yesterday", unread: 1, verified: true },
];

const MESSAGES = [
  { from: "them", text: "Hello, is the iPhone still available?", time: "10:22 AM" },
  { from: "me", text: "Yes it is! Great condition, no scratches.", time: "10:25 AM" },
  { from: "them", text: "Can you do Rs 370,000?", time: "10:26 AM" },
  { from: "me", text: "Best I can do is 378,000. It's barely used.", time: "10:30 AM" },
  { from: "them", text: "Let me think about it. Can we meet in DHA?", time: "10:35 AM" },
];

export default function ChatsPage() {
  const [active, setActive] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(MESSAGES);

  function send() {
    if (!msg.trim()) return;
    setMessages(m => [...m, { from: "me", text: msg, time: "Now" }]);
    setMsg("");
  }

  if (active) {
    const conv = CONVERSATIONS.find(c => c.id === active)!;
    return (
      <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setActive(null)} className="p-1.5 -ml-1">
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {conv.seller[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{conv.seller}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{conv.adTitle}</p>
            </div>
            <button className="p-1.5">
              <MoreVertical size={18} strokeWidth={2} className="text-[var(--text-muted)]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20">
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
            {/* Safety notice */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <Flag size={11} strokeWidth={2} />
                Never share phone numbers or send money in advance
              </span>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === "me"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm bg-white border border-[var(--border)] text-[var(--text-primary)]"
                  }`}
                  style={{ background: m.from === "me" ? "var(--brand-green)" : undefined }}
                >
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/60 text-right" : "text-[var(--text-muted)]"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] px-4 py-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              className="flex-1 bg-[var(--bg)] rounded-full px-4 py-2.5 text-sm outline-none border border-[var(--border)] focus:border-[var(--brand-green)]"
            />
            <button
              onClick={send}
              disabled={!msg.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors"
              style={{ background: "var(--brand-green)" }}
            >
              <Send size={16} strokeWidth={2.5} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Messages</h1>
          </div>
          <div className="bg-white">
            {CONVERSATIONS.map((conv, i) => (
              <button
                key={conv.id}
                onClick={() => setActive(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-[var(--bg)] transition-colors text-left ${i > 0 ? "border-t border-[var(--border)]" : ""}`}
              >
                <div className="w-11 h-11 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                  {conv.seller[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{conv.seller}</p>
                    <span className="text-xs text-[var(--text-muted)] flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate mb-0.5">{conv.adTitle}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-secondary)] truncate">{conv.lastMsg}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ml-2"
                        style={{ background: "var(--brand-green)" }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
