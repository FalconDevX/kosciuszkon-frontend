"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  dictionary: Dictionary["home"];
};

export function HomeMiniChat({ locale, dictionary }: Props) {
  const h = dictionary;
  const router = useRouter();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goToChatbot = (text: string) => {
    const q = text.trim();
    if (!q) return;
    router.push(`/${locale}/chatbot-ai?q=${encodeURIComponent(q)}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    goToChatbot(draft);
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={h.miniChatTitle}
          className="pointer-events-auto w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-zinc-700/90 bg-zinc-900/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <div className="relative rounded-xl border border-zinc-600/80 bg-zinc-950/80 px-4 py-3 text-base leading-relaxed text-zinc-200 md:text-lg after:absolute after:left-1/2 after:top-full after:z-0 after:-ml-2 after:border-8 after:border-transparent after:border-t-zinc-950/80 after:content-['']">
            {h.miniChatBubble}
          </div>
          <form onSubmit={onSubmit} className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={h.miniChatPlaceholder}
              className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-600 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-blue-500/55"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!draft.trim()}
              className="h-10 shrink-0 cursor-pointer bg-blue-500 px-3 text-zinc-950 hover:bg-blue-400 disabled:opacity-50"
            >
              <Send className="size-4" aria-hidden />
              <span className="sr-only">{h.miniChatSend}</span>
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full rounded-lg py-1.5 text-center text-xs text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-300"
          >
            {h.miniChatClose}
          </button>
        </div>
      ) : null}

      <div className="pointer-events-auto flex flex-col items-center gap-1">
        {!open ? (
          <div className="max-w-xs rounded-lg border border-blue-500/25 bg-blue-950/40 px-3 py-2 text-center text-sm leading-snug text-blue-100/95 shadow-sm sm:max-w-sm md:max-w-md md:px-4 md:py-2.5 md:text-base">
            {h.miniChatHint}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-12 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/95 text-blue-300 shadow-lg transition-colors hover:border-blue-500/40 hover:bg-zinc-800 hover:text-blue-200 md:size-14"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={open ? h.miniChatCloseFab : h.miniChatOpenFab}
        >
          {open ? <X className="size-5 md:size-6" /> : <Bot className="size-5 md:size-6" />}
        </button>
      </div>
    </div>
  );
}
