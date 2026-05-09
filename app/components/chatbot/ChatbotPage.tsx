"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Navbar } from "@/app/components/home/Navbar";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export function ChatbotPage({ locale, dictionary }: Props) {
  const [prompt, setPrompt] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = prompt.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content:
        locale === "pl"
          ? "To testowe okno czatu. Podlaczenie do AI mozemy dodac w kolejnym kroku."
          : "This is a placeholder chat window. We can connect it to AI in the next step.",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setChatStarted(true);
    setPrompt("");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />

      <section className="px-4 py-6 md:px-8">
        <div className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h1 className="text-lg font-semibold">Chatbot AI</h1>
          </div>

          {!chatStarted ? (
            <div className="flex flex-1 items-center justify-center px-5">
              <div className="max-w-xl text-center">
                <h2 className="text-2xl font-semibold text-zinc-100">
                  {locale === "pl" ? "Witaj w Chatbot AI" : "Welcome to Chatbot AI"}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  {locale === "pl"
                    ? "Zadaj pierwsze pytanie, aby uruchomic czat."
                    : "Ask your first question to start the chat."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-blue-500/20 text-blue-100"
                      : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="border-t border-zinc-800 p-3">
            <div className="flex items-center gap-2">
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={locale === "pl" ? "Wpisz prompt..." : "Type a prompt..."}
                className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none placeholder:text-zinc-500 focus:border-blue-500/60"
              />
              <Button type="submit" className="h-11 cursor-pointer bg-blue-500 text-zinc-100 hover:bg-blue-500/90">
                <Send className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
