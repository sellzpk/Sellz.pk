"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Send, ArrowLeft, Flag, MoreVertical, Loader2, Inbox } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { ChatRow, MessageRow, UserRow, AdRow } from "@/lib/types";

type ChatWithMeta = ChatRow & {
  ads: Pick<AdRow, "title"> | null;
  buyer: Pick<UserRow, "id" | "full_name"> | null;
  seller: Pick<UserRow, "id" | "full_name"> | null;
  lastMessage?: string;
  unread?: number;
};

const PHONE_RE = /(\+92|0092|03)\d[\d\s\-]{7,}/;
const URL_RE = /https?:\/\//i;

function nowTime() {
  return new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatWithMeta[]>([]);
  const [activeChat, setActiveChat] = useState<ChatWithMeta | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeChat) return;
    loadMessages(activeChat.id);

    const supabase = createClient();
    const channel = supabase
      .channel(`chat:${activeChat.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${activeChat.id}` },
        payload => {
          setMessages(prev => [...prev, payload.new as MessageRow]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChat?.id]);

  async function loadChats() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("chats")
      .select(`
        *,
        ads(title),
        buyer:users!chats_buyer_id_fkey(id, full_name),
        seller:users!chats_seller_id_fkey(id, full_name)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    setChats((data as ChatWithMeta[]) ?? []);
    setLoading(false);
  }

  async function loadMessages(chatId: number) {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || !activeChat || !userId || sending) return;

    let isBlocked = false;
    let blockReason: string | null = null;
    if (PHONE_RE.test(text)) { isBlocked = true; blockReason = "phone"; }
    else if (URL_RE.test(text)) { isBlocked = true; blockReason = "url"; }

    setSending(true);
    const supabase = createClient();
    await supabase.from("messages").insert({
      chat_id: activeChat.id,
      sender_id: userId,
      content: text,
      is_blocked: isBlocked,
      block_reason: blockReason,
    });
    setInput("");
    setSending(false);
  }

  if (activeChat) {
    const otherParty = activeChat.buyer_id === userId ? activeChat.seller : activeChat.buyer;
    const otherName = otherParty?.full_name ?? "User";

    return (
      <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => { setActiveChat(null); setMessages([]); }} className="p-1.5 -ml-1">
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "var(--brand-green)" }}
            >
              {otherName[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{otherName}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{activeChat.ads?.title ?? ""}</p>
            </div>
            <button className="p-1.5">
              <MoreVertical size={18} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20">
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#FFF8E1", color: "#92400E" }}>
                <Flag size={11} strokeWidth={2} />
                Never share phone numbers or send money in advance
              </span>
            </div>

            {messages.map(msg => {
              const isMine = msg.sender_id === userId;
              if (msg.is_blocked) {
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[72%] px-3 py-2 rounded-2xl border text-xs" style={{ background: "#FEF3C7", borderColor: "#FCD34D" }}>
                      <p className="font-semibold mb-0.5" style={{ color: "#92400E" }}>
                        {msg.block_reason === "phone" ? "Share number using Request button" : "External links not allowed"}
                      </p>
                      <p className="line-through opacity-50" style={{ color: "#92400E" }}>{msg.content}</p>
                    </div>
                  </div>
                );
              }
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine ? "rounded-br-sm" : "rounded-bl-sm border border-[var(--border)]"}`}
                    style={{
                      background: isMine ? "var(--brand-green)" : "white",
                      color: isMine ? "white" : "var(--text-primary)",
                    }}
                  >
                    <p>{msg.content}</p>
                    <p
                      className="text-[10px] mt-1"
                      style={{
                        color: isMine ? "rgba(255,255,255,0.6)" : "var(--text-muted)",
                        textAlign: isMine ? "right" : "left",
                      }}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </main>

        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] px-4 py-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none border border-[var(--border)] focus:border-[var(--brand-green)] transition-colors"
              style={{ background: "var(--bg)" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors"
              style={{ background: "var(--brand-green)" }}
            >
              {sending ? <Loader2 size={16} strokeWidth={2} className="text-white animate-spin" /> : <Send size={16} strokeWidth={2.5} className="text-white" />}
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
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Messages</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} strokeWidth={2} className="animate-spin" style={{ color: "var(--brand-green)" }} />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--brand-green-light)] flex items-center justify-center mb-4">
                <Inbox size={28} strokeWidth={1.5} style={{ color: "var(--brand-green)" }} />
              </div>
              <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No messages yet</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Message a seller to start a conversation</p>
            </div>
          ) : (
            <div className="bg-white">
              {chats.map((chat, i) => {
                const otherParty = chat.buyer_id === userId ? chat.seller : chat.buyer;
                const name = otherParty?.full_name ?? "User";
                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-[var(--bg)] transition-colors text-left ${i > 0 ? "border-t border-[var(--border)]" : ""}`}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                      style={{ background: "var(--brand-green)" }}
                    >
                      {name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{name}</p>
                        <span className="text-xs flex-shrink-0 ml-2" style={{ color: "var(--text-muted)" }}>
                          {relTime(chat.created_at)}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {chat.ads?.title ?? "Ad"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
