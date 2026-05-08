"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Phone, ChevronDown, AlertCircle, Loader2, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PHONE_RE = /(\+92|0092|03)\d[\d\s\-]{7,}/;
const URL_RE = /https?:\/\//i;

function nowTime() {
  return new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatWaDisplay(num: string) {
  const digits = num.replace(/^0/, "");
  return `+92 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

function waHref(num: string) {
  return `https://wa.me/92${num.replace(/^0/, "")}`;
}

interface DBMessage {
  id: number;
  chat_id: number;
  sender_id: string;
  content: string;
  is_blocked: boolean;
  block_reason: string | null;
  created_at: string;
}

const WaIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
  </svg>
);

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerCity: string;
  sellerHasWhatsapp: boolean;
  waNumber?: string;
  numberRevealed: boolean;
  onChatStarted: () => void;
  onNumberRevealed: () => void;
  adId: number;
  sellerId: string;
}

export function ChatPanel({
  isOpen, onClose, sellerName, sellerCity,
  sellerHasWhatsapp, waNumber, numberRevealed,
  onChatStarted, onNumberRevealed,
  adId, sellerId,
}: ChatPanelProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [numberRequested, setNumberRequested] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const numberChipShown = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!isOpen || !userId || !adId) return;
    loadExistingChat();
  }, [isOpen, userId, adId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `chat_id=eq.${chatId}`,
      }, payload => {
        setMessages(prev => {
          const msg = payload.new as DBMessage;
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  // Inject number chip when revealed
  useEffect(() => {
    if (numberRevealed && waNumber && !numberChipShown.current) {
      numberChipShown.current = true;
    }
  }, [numberRevealed, waNumber]);

  async function loadExistingChat() {
    setLoadingChat(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("chats")
      .select("id, phone_revealed")
      .eq("ad_id", adId)
      .eq("buyer_id", userId!)
      .maybeSingle();

    if (data) {
      setChatId(data.id);
      onChatStarted();
      if (data.phone_revealed) onNumberRevealed();
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", data.id)
        .order("created_at", { ascending: true });
      setMessages(msgs ?? []);
    }
    setLoadingChat(false);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending || !userId) return;

    let blocked = false;
    let blockReason: string | null = null;
    if (PHONE_RE.test(text)) { blocked = true; blockReason = "phone"; }
    else if (URL_RE.test(text)) { blocked = true; blockReason = "url"; }

    setSending(true);
    const supabase = createClient();
    let currentChatId = chatId;

    if (!currentChatId) {
      const { data, error } = await supabase
        .from("chats")
        .insert({ ad_id: adId, buyer_id: userId, seller_id: sellerId })
        .select("id")
        .single();
      if (error || !data) { setSending(false); return; }
      currentChatId = data.id;
      setChatId(currentChatId);
      onChatStarted();
    }

    await supabase.from("messages").insert({
      chat_id: currentChatId,
      sender_id: userId,
      content: text,
      is_blocked: blocked,
      block_reason: blockReason,
    });

    setInput("");
    setSending(false);
    inputRef.current?.focus();
  }

  async function requestNumber() {
    if (numberRequested || !chatId) return;
    setNumberRequested(true);
    // Insert a system message visible to buyer
    const supabase = createClient();
    if (userId) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        sender_id: userId,
        content: "📞 WhatsApp number ki request bheji gayi",
        is_blocked: false,
        block_reason: null,
      });
    }
    // Simulate seller approval after 2s
    setTimeout(async () => {
      await createClient().from("chats").update({ phone_revealed: true }).eq("id", chatId);
      onNumberRevealed();
    }, 2000);
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} />
      <div
        className="fixed z-50 bg-white flex flex-col bottom-0 left-0 right-0 h-[75vh] rounded-t-2xl md:top-0 md:right-0 md:left-auto md:w-[400px] md:h-screen md:rounded-none md:border-l md:shadow-xl"
        style={{ borderColor: "var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle mobile */}
        <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--bg)] transition-colors">
            <ChevronDown size={20} strokeWidth={2} className="md:hidden" />
            <X size={20} strokeWidth={2} className="hidden md:block" />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: "var(--brand-green)" }}>
            {sellerName[0]?.toUpperCase() ?? "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{sellerName}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sellerCity}</p>
          </div>
          {sellerHasWhatsapp && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(37,211,102,0.12)" }} title="Has WhatsApp">
              <WaIcon size={15} color="#25D366" />
            </div>
          )}
        </div>

        {/* Safety notice */}
        <div className="px-4 py-1.5 border-b flex-shrink-0" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
          <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>Messages are monitored for your safety</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {!userId ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <LogIn size={32} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Login to send messages</p>
              <a href="/auth" className="btn-primary text-sm px-5 py-2">Login / Sign up</a>
            </div>
          ) : loadingChat ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--brand-green)" }} />
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Start the conversation</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ask about availability, condition, or price</p>
                </div>
              )}
              {messages.map(msg => {
                const isBuyer = msg.sender_id === userId;

                if (msg.is_blocked) {
                  return (
                    <div key={msg.id} className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[75%] rounded-2xl rounded-br-sm px-3 py-2 border" style={{ background: "#FEF3C7", borderColor: "#FCD34D" }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <AlertCircle size={11} strokeWidth={2} style={{ color: "#92400E" }} />
                          <span className="text-[10px] font-semibold" style={{ color: "#92400E" }}>
                            {msg.block_reason === "phone" ? "Share number using the button below" : "External links are not allowed"}
                          </span>
                        </div>
                        <p className="text-xs line-through opacity-50" style={{ color: "#92400E" }}>{msg.content}</p>
                        <p className="text-[10px] mt-1 text-right" style={{ color: "var(--text-muted)" }}>{nowTime()}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 ${isBuyer ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}`}
                      style={{ background: isBuyer ? "var(--brand-green)" : "#F0F0EE", color: isBuyer ? "white" : "#1A1A1A" }}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: isBuyer ? "rgba(255,255,255,0.6)" : "var(--text-muted)", textAlign: isBuyer ? "right" : "left" }}>
                        {new Date(msg.created_at).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Number chip when revealed */}
              {numberRevealed && waNumber && (
                <div className="flex justify-start">
                  <a href={waHref(waNumber)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-2xl rounded-bl-sm border transition-opacity hover:opacity-80"
                    style={{ borderColor: "var(--brand-green)", background: "var(--brand-green-light)" }}>
                    <WaIcon size={15} color="var(--brand-green)" />
                    <span className="text-sm font-semibold" style={{ color: "var(--brand-green)" }}>{formatWaDisplay(waNumber)}</span>
                    <span className="text-xs opacity-70" style={{ color: "var(--brand-green)" }}>· Open in WhatsApp →</span>
                  </a>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Action bar */}
        {userId && sellerHasWhatsapp && !numberRevealed && (
          <div className="px-4 py-2 border-t flex-shrink-0" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
            <button
              onClick={requestNumber}
              disabled={numberRequested || !chatId}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
              style={numberRequested || !chatId
                ? { borderColor: "var(--border)", color: "var(--text-muted)", cursor: "not-allowed" }
                : { borderColor: "var(--brand-green)", color: "var(--brand-green)" }}
            >
              <Phone size={12} strokeWidth={2} />
              {numberRequested ? "Request sent — waiting for seller..." : "Request WhatsApp Number"}
            </button>
          </div>
        )}

        {/* Input */}
        {userId && (
          <div className="px-4 py-3 border-t flex items-end gap-2 flex-shrink-0 bg-white" style={{ borderColor: "var(--border)" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ borderColor: "var(--border)", maxHeight: 100 }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--brand-green)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--brand-green)" }}
            >
              {sending ? <Loader2 size={16} strokeWidth={2} color="white" className="animate-spin" /> : <Send size={16} strokeWidth={2} color="white" />}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
