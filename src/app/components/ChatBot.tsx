"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ChatBot.module.css";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const GREETING =
  "Hi! I'm Ziyah Support - your packaging assistant. Ask me about bento boxes, sushi trays, wholesale pricing, delivery, or our Pasay store. How can I help?";

const QUICK = [
  "Pricing for hard bento boxes",
  "Do you deliver nationwide?",
  "Store location and hours",
  "Help me pick a sushi tray",
];

let idCounter = 1;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: idCounter++, from: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, typing]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;

    busyRef.current = true;
    setTyping(true);
    setInput("");

    const userMsg: Message = { id: idCounter++, from: "user", text: trimmed };
    const nextMessages = [...messagesRef.current, userMsg];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);

    try {
      // Send conversation without the static greeting (avoids Gemini role issues + loops)
      const payloadMessages = nextMessages
        .filter((m) => !(m.from === "bot" && m.text === GREETING))
        .map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = (await res.json()) as { reply?: string };
      let reply =
        data.reply?.trim() ||
        "Sorry, I couldn't answer that just now. Please try again or use Contact / Get a Quote.";

      const lastBot = [...nextMessages]
        .reverse()
        .find((m) => m.from === "bot" && m.text !== GREETING)?.text;
      if (lastBot && reply === lastBot) {
        reply = `${reply}\n\nIf you'd like, tell me the product size or quantity and I'll get more specific.`;
      }

      const botMsg: Message = { id: idCounter++, from: "bot", text: reply };
      const withBot = [...messagesRef.current, botMsg];
      messagesRef.current = withBot;
      setMessages(withBot);
    } catch {
      const botMsg: Message = {
        id: idCounter++,
        from: "bot",
        text: "Connection issue - please try again in a moment, or reach us through Contact.",
      };
      const withBot = [...messagesRef.current, botMsg];
      messagesRef.current = withBot;
      setMessages(withBot);
    } finally {
      setTyping(false);
      busyRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void sendMessage(input);
  };

  return (
    <>
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <div className={`${styles.window} ${open ? styles.windowOpen : ""}`} role="dialog" aria-label="Chat support">
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.avatar}>Z</div>
            <div>
              <div className={styles.headerName}>Ziyah Support</div>
              <div className={styles.headerStatus}>
                <span className={styles.dot} /> Online - site catalog
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.msg} ${msg.from === "user" ? styles.msgUser : styles.msgBot}`}>
              <div className={styles.bubble}>{msg.text}</div>
            </div>
          ))}
          {typing && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <div className={styles.bubble}>
                <span className={styles.typingDots}>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={styles.quickReplies}>
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              className={styles.quickBtn}
              disabled={typing}
              onClick={() => void sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder="Ask about products, prices, delivery..."
            value={input}
            disabled={typing}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={styles.sendBtn}
            onClick={() => void sendMessage(input)}
            disabled={typing || !input.trim()}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
