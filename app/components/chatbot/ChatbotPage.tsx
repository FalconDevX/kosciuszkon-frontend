"use client";

import { type ChangeEvent, FormEvent, useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
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
  fileName?: string;
};

export function ChatbotPage({ locale, dictionary }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = prompt.trim();
    const file = pendingFile;
    if (!text && !file) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      fileName: file?.name,
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
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (next) {
      setPendingFile(next);
    }
    event.target.value = "";
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
                  {message.fileName ? (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-100/95">
                      <Paperclip className="size-3.5 shrink-0 opacity-90" aria-hidden />
                      <span className="min-w-0 break-all">{message.fileName}</span>
                    </div>
                  ) : null}
                  {message.content ? <div className="whitespace-pre-wrap">{message.content}</div> : null}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="border-t border-zinc-800 p-3">
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              tabIndex={-1}
              onChange={onFileChange}
            />
            {pendingFile ? (
              <div className="mb-2 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/90 px-2.5 py-2 text-xs text-zinc-300">
                <Paperclip className="size-3.5 shrink-0 text-zinc-400" aria-hidden />
                <span className="min-w-0 flex-1 truncate" title={pendingFile.name}>
                  {pendingFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPendingFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                  aria-label={locale === "pl" ? "Usuń załącznik" : "Remove attachment"}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 cursor-pointer border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-900"
                aria-label={locale === "pl" ? "Dodaj plik" : "Attach file"}
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="size-4" />
              </Button>
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={locale === "pl" ? "Wpisz prompt..." : "Type a prompt..."}
                className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none placeholder:text-zinc-500 focus:border-blue-500/60"
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
