"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";
import { IconMessenger } from "./Icons";
import { SITE } from "@/data/site";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const FAQ: { pattern: RegExp; answer: string }[] = [
  { pattern: /hello|hi|hey|good (morning|afternoon|evening)/i, answer: "Hi there! Welcome to Ziyah Packaging Supplies. How can I help you today?" },
  { pattern: /bento|bento box/i, answer: "We carry 3-compartment, 5-compartment, and kraft paper bento boxes. Prices start at 8 per piece. Check our Products page for details!" },
  { pattern: /sushi|sushi tray/i, answer: "We have clear OPS sushi trays (small and large) and premium matte-black display trays. Prices start at 10 per piece." },
  { pattern: /clamshell/i, answer: "We offer clear PET and black-base clamshell containers in 6-inch and 9-inch sizes, plus round burger clamshells. Starting at 6 per piece." },
  { pattern: /cup|cups|lid/i, answer: "We carry 16oz and 22oz clear disposable cups plus dome lids. Starting at 2 per piece for lids." },
  { pattern: /tray|food tray/i, answer: "We have foam trays, PP trays with lids, and aluminum foil trays for catering. Starting at 4 per piece." },
  { pattern: /wrap|film|cling|baking paper/i, answer: "We carry PVC cling wrap, shrink wrap film, and greaseproof baking paper. Starting at 120 per roll." },
  { pattern: /price|cost|how much|magkano/i, answer: "Our prices start from 2 per piece for lids up to 250 for film rolls. Visit our Products page for full pricing, or send us an inquiry for bulk quotes!" },
  { pattern: /bulk|wholesale|order/i, answer: "Yes, we accommodate bulk and wholesale orders! Send us an inquiry via our Contact page for a custom quote." },
  { pattern: /shopee|online store|shop online/i, answer: `You can shop our products on Shopee: ${SITE.social.shopee.href}` },
  { pattern: /messenger|message (me|us)|chat (with|on)/i, answer: `Message us anytime on Messenger: ${SITE.social.messenger.href}` },
  { pattern: /facebook|social|page/i, answer: `Follow us on Facebook: ${SITE.social.facebook.href} — or chat with us on Messenger: ${SITE.social.messenger.href}` },
  { pattern: /deliver|shipping|nationwide|philippines/i, answer: `We serve nationwide across the Philippines. Contact us at ${SITE.phone}, email ${SITE.email}, message us on Messenger, or use Contact / Get a Quote. You can also shop on Shopee.` },
  { pattern: /address|location|where/i, answer: `We are at ${SITE.addressShort}. Plus code: ${SITE.plusCode}.` },
  { pattern: /hour|open|close/i, answer: `Hours: ${SITE.hoursSummary}.` },
  { pattern: /phone|contact|number|call|viber|email/i, answer: `Call/Viber/SMS ${SITE.phone}, email ${SITE.email}, or chat on Messenger: ${SITE.social.messenger.href}. You can also use our Contact page.` },
  { pattern: /disposable/i, answer: "Most of our products are disposable and food-grade safe. We also carry reusable options. Check the Products page for type filters." },
  { pattern: /eco|environment|biodegradable/i, answer: "We offer eco-friendly options like kraft paper bento boxes and biodegradable alternatives!" },
  { pattern: /thank|thanks/i, answer: "You are welcome! Is there anything else I can help you with?" },
  { pattern: /bye|goodbye/i, answer: "Goodbye! Feel free to come back anytime. Have a great day!" },
];

const GREETING =
  "Hi! I am Ziyah support assistant. Ask me about our products, pricing, location, or delivery — or chat with us on Messenger anytime. How can I help you?";

let idCounter = 1;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: idCounter++, from: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: idCounter++, from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const match = FAQ.find((f) => f.pattern.test(text));
    const reply = match
      ? match.answer
      : `I am not sure about that. You can reach us at ${SITE.phone}, chat on Messenger (${SITE.social.messenger.href}), or visit our Contact page for personalized help.`;

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: idCounter++, from: "bot", text: reply }]);
      setTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage(input);
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
                <span className={styles.dot} /> Online
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
          {["Pricing", "Delivery", "Location", "Bulk order"].map((q) => (
            <button key={q} className={styles.quickBtn} onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        <a
          href={SITE.social.messenger.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.messengerLink}
        >
          <IconMessenger size={16} />
          Continue on Messenger
        </a>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.sendBtn} onClick={() => sendMessage(input)} aria-label="Send">
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
