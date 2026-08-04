import { NextResponse } from "next/server";
import {
  CHAT_SYSTEM_PROMPT,
  buildSiteReply,
  type ChatTurn,
} from "@/lib/chatContext";
import { SITE } from "@/data/site";

export const runtime = "nodejs";

type Body = {
  messages?: { role?: string; content?: string }[];
};

const MAX_HISTORY = 10;
const MAX_MESSAGE_LEN = 1000;

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i);

function sanitizeMessages(input: Body["messages"]): ChatTurn[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).trim().slice(0, MAX_MESSAGE_LEN),
    }));
}

/** Gemini requires history to start with user and alternate roles. */
function normalizeForGemini(messages: ChatTurn[]): ChatTurn[] {
  let start = 0;
  while (start < messages.length && messages[start].role !== "user") start += 1;
  const sliced = messages.slice(start);
  const merged: ChatTurn[] = [];
  for (const m of sliced) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === m.role) {
      prev.content = `${prev.content}\n${m.content}`;
    } else {
      merged.push({ role: m.role, content: m.content });
    }
  }
  return merged;
}

function collapseRepeatedParagraphs(text: string): string {
  const parts = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    const norm = part.toLowerCase().replace(/\s+/g, " ");
    const dup = out.some(
      (o) => o.toLowerCase().replace(/\s+/g, " ") === norm
    );
    if (!dup) out.push(part);
  }
  return out.join("\n\n");
}

async function askGemini(messages: ChatTurn[]): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const contents = normalizeForGemini(messages).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  if (!contents.length || contents[0].role !== "user") return null;

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              temperature: 0.75,
              maxOutputTokens: 550,
              topP: 0.9,
            },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.warn(`Gemini ${model} error`, res.status, errText.slice(0, 180));
        continue;
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("")
        .trim();
      if (text) return collapseRepeatedParagraphs(text);
    } catch (err) {
      console.warn(`Gemini ${model} failed`, err);
    }
  }

  return null;
}

async function askOpenAI(messages: ChatTurn[]): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.75,
      max_tokens: 550,
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...normalizeForGemini(messages).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn("OpenAI chat error", res.status, errText.slice(0, 180));
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text ? collapseRepeatedParagraphs(text) : null;
}

function tooSimilar(a: string, b: string): boolean {
  const na = a.toLowerCase().replace(/\s+/g, " ").slice(0, 160);
  const nb = b.toLowerCase().replace(/\s+/g, " ").slice(0, 160);
  if (!na || !nb) return false;
  return na === nb || (na.length > 40 && nb.includes(na.slice(0, 40)));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const messages = sanitizeMessages(body.messages);
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const lastAssistant =
      [...messages].reverse().find((m) => m.role === "assistant")?.content || "";

    if (!lastUser) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    let provider: "gemini" | "openai" | "site" = "site";
    let reply = await askGemini(messages);
    if (reply) provider = "gemini";
    else {
      reply = await askOpenAI(messages);
      if (reply) provider = "openai";
    }

    if (!reply || tooSimilar(reply, lastAssistant)) {
      reply = buildSiteReply(lastUser.content, messages);
      provider = "site";
    }

    return NextResponse.json({
      reply: collapseRepeatedParagraphs(reply),
      provider,
    });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      {
        reply: `Sorry — I hit a snag. Please try again, or reach us at ${SITE.phone} / ${SITE.email}.`,
        provider: "error",
      },
      { status: 200 }
    );
  }
}
