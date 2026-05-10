"use client";
import { type ChangeEvent, FormEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Globe, MessageSquarePlus, Paperclip, Send, Trash2, X } from "lucide-react";
import { Navbar } from "@/app/components/home/Navbar";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
import { AssistantMarkdown } from "@/app/components/chatbot/AssistantMarkdown";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
    loadChatSessions,
    saveChatSessions,
    sessionTitleFromMessages,
    type ChatSessionRecord,
    type StoredChatMessage,
} from "@/lib/chatbot-history-storage";
import { postAiChat, type AIChatSource } from "@/services/api/ai-chat-api";

type Props = {
    locale: Locale;
    dictionary: Dictionary;
};

type Message = StoredChatMessage;

function createEmptySessionRecord(locale: Locale): ChatSessionRecord {
    return {
        id: crypto.randomUUID(),
        title: locale === "pl" ? "Nowa rozmowa" : "New chat",
        updatedAt: Date.now(),
        messages: [],
    };
}

function AssistantTyping({ searchingWeb, locale }: {
    searchingWeb?: boolean;
    locale: Locale;
}) {
    return (<span className="inline-flex items-center gap-2 py-0.5" aria-live="polite">
      {searchingWeb ? (<>
          <Globe className="size-3.5 shrink-0 animate-pulse text-blue-300" aria-hidden/>
          <span className="text-xs text-zinc-400">
            {locale === "pl" ? "Szukam w sieci..." : "Searching the web..."}
          </span>
        </>) : null}
      <span className="inline-flex items-center gap-1">
        {[0, 150, 300].map((delay) => (<span key={delay} className="size-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: `${delay}ms` }}/>))}
      </span>
    </span>);
}

function getHostname(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    }
    catch {
        return url;
    }
}

export function ChatbotPage({ locale, dictionary }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQConsumed = useRef(false);
    const [sessions, setSessions] = useState<ChatSessionRecord[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const emptyLabel = locale === "pl" ? "Nowa rozmowa" : "New chat";
    const historyHeading = locale === "pl" ? "Historia" : "History";
    const newChatLabel = locale === "pl" ? "Nowa rozmowa" : "New chat";
    const deleteLabel = locale === "pl" ? "Usuń rozmowę" : "Delete chat";

    const activeSession = useMemo(
        () => sessions.find((s) => s.id === activeId),
        [sessions, activeId],
    );
    const messages: Message[] = activeSession?.messages ?? [];
    const chatStarted = messages.length > 0;

    const sortedSessions = useMemo(
        () => [...sessions].sort((a, b) => b.updatedAt - a.updatedAt),
        [sessions],
    );

    useEffect(() => {
        const loaded = loadChatSessions(locale);
        if (loaded.length === 0) {
            const s = createEmptySessionRecord(locale);
            setSessions([s]);
            setActiveId(s.id);
        }
        else {
            setSessions(loaded);
            const sorted = [...loaded].sort((a, b) => b.updatedAt - a.updatedAt);
            setActiveId(sorted[0].id);
        }
        setHydrated(true);
    }, [locale]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        saveChatSessions(locale, sessions);
    }, [sessions, locale, hydrated]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        if (activeId && sessions.some((s) => s.id === activeId)) {
            return;
        }
        const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
        if (sorted[0]) {
            setActiveId(sorted[0].id);
        }
    }, [sessions, activeId, hydrated]);

    useEffect(() => {
        if (initialQConsumed.current) {
            return;
        }
        const raw = searchParams.get("q");
        if (raw === null) {
            return;
        }
        initialQConsumed.current = true;
        let text = raw;
        try {
            text = decodeURIComponent(raw);
        }
        catch {
        }
        text = text.replace(/\+/g, " ").trim();
        if (text) {
            setPrompt(text);
        }
        router.replace(`/${locale}/chatbot-ai`, { scroll: false });
    }, [searchParams, router, locale]);

    const startNewChat = () => {
        const s = createEmptySessionRecord(locale);
        setSessions((prev) => [s, ...prev]);
        setActiveId(s.id);
        setPrompt("");
        setPendingFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const selectSession = (id: string) => {
        setActiveId(id);
        setPrompt("");
        setPendingFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const deleteSession = (id: string, event: MouseEvent) => {
        event.stopPropagation();
        setSessions((prev) => {
            const filtered = prev.filter((s) => s.id !== id);
            return filtered.length > 0 ? filtered : [createEmptySessionRecord(locale)];
        });
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!hydrated || !activeId) {
            return;
        }
        const text = prompt.trim();
        const file = pendingFile;
        if (!text && !file) {
            return;
        }
        const useWebSearch = webSearchEnabled;
        const userId = Date.now();
        const assistantId = userId + 1;
        const userMessage: Message = {
            id: userId,
            role: "user",
            content: text,
            fileName: file?.name,
        };
        const assistantShell: Message = {
            id: assistantId,
            role: "assistant",
            content: "",
            searchingWeb: useWebSearch,
        };

        setSessions((prev) =>
            prev.map((s) => {
                if (s.id !== activeId) {
                    return s;
                }
                const nextMsgs = [...s.messages, userMessage, assistantShell];
                return {
                    ...s,
                    messages: nextMsgs,
                    updatedAt: Date.now(),
                    title: sessionTitleFromMessages(nextMsgs, s.title, emptyLabel),
                };
            }));

        setPrompt("");
        setPendingFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsSending(true);

        const fileOnlyMessage = locale === "pl"
            ? `Przesłano plik „${file?.name ?? ""}”. Co mogę z nim zrobić?`
            : `Uploaded file "${file?.name ?? ""}". What can I do with it?`;
        const networkError = locale === "pl"
            ? "Nie udało się połączyć z serwerem. Sprawdź połączenie."
            : "Could not reach the server. Check your connection.";

        try {
            let messageForModel = text;
            if (file && !messageForModel) {
                messageForModel = fileOnlyMessage;
            }
            const history = messages
                .filter((m): m is Message & { content: string } =>
                    (m.role === "user" || m.role === "assistant") && Boolean(m.content?.trim()))
                .map((m) => ({ role: m.role, content: m.content }));
            const { response: reply, model, sources } = await postAiChat(messageForModel, {
                file,
                history,
                webSearch: useWebSearch,
                locale,
            });
            setSessions((prev) =>
                prev.map((s) => {
                    if (s.id !== activeId) {
                        return s;
                    }
                    return {
                        ...s,
                        messages: s.messages.map((m) =>
                            m.id === assistantId
                                ? { ...m, content: reply, model, sources, searchingWeb: false }
                                : m,
                        ),
                        updatedAt: Date.now(),
                    };
                }));
        }
        catch (error) {
            const detail = error instanceof Error ? error.message : networkError;
            setSessions((prev) =>
                prev.map((s) => {
                    if (s.id !== activeId) {
                        return s;
                    }
                    return {
                        ...s,
                        messages: s.messages.map((m) =>
                            m.id === assistantId ? { ...m, content: detail, searchingWeb: false } : m,
                        ),
                        updatedAt: Date.now(),
                    };
                }));
        }
        finally {
            setIsSending(false);
        }
    };

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.files?.[0];
        if (next) {
            setPendingFile(next);
        }
        event.target.value = "";
    };

    if (!hydrated) {
        return (<main className="relative min-h-screen bg-zinc-950 text-zinc-100">
          <FallingStarsBackground />
          <Navbar locale={locale} dictionary={dictionary}/>
          <section className="relative z-10 flex min-h-[50vh] items-center justify-center px-4">
            <p className="text-sm text-zinc-400">{locale === "pl" ? "Ładowanie…" : "Loading…"}</p>
          </section>
        </main>);
    }

    return (<main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <FallingStarsBackground />
      <Navbar locale={locale} dictionary={dictionary}/>

      <section className="relative z-10 px-4 py-6 md:px-8">
        <div className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 md:flex-row">
          <aside className="flex max-h-[min(32vh,280px)] w-full shrink-0 flex-col border-zinc-800 md:max-h-none md:h-auto md:w-64 md:border-r">
            <div className="border-b border-zinc-800 px-3 py-3">
              <Button type="button" variant="outline" size="sm" onClick={startNewChat} className="w-full cursor-pointer gap-2 border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-800">
                <MessageSquarePlus className="size-4 shrink-0"/>
                {newChatLabel}
              </Button>
              <p className="mt-2 px-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                {historyHeading}
              </p>
            </div>
            <div className="chatbot-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2">
              {sortedSessions.map((s) => {
                    const active = s.id === activeId;
                    return (<div key={s.id} role="button" tabIndex={0} onClick={() => selectSession(s.id)} onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                selectSession(s.id);
                            }
                        }} className={`group flex cursor-pointer items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${active ? "bg-zinc-800 text-zinc-50" : "text-zinc-300 hover:bg-zinc-800/60"}`}>
                        <span className="min-w-0 flex-1 line-clamp-2 leading-snug">{s.title}</span>
                        <button type="button" onClick={(e) => deleteSession(s.id, e)} className="shrink-0 rounded p-1 text-zinc-500 opacity-70 hover:bg-zinc-700 hover:text-zinc-200 group-hover:opacity-100" aria-label={deleteLabel} title={deleteLabel}>
                          <Trash2 className="size-3.5"/>
                        </button>
                      </div>);
                })}
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-3">
              <Image
                src="/safe_click_dark_small.png"
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 object-contain"
              />
              <Image
                src="/safe_click_dark_title.png"
                alt="SafeClick"
                width={200}
                height={48}
                className="h-8 w-auto max-w-[min(14rem,calc(100%-5rem))] object-contain object-left"
              />
              <span className="ml-auto hidden shrink-0 text-xs font-medium uppercase tracking-wide text-zinc-500 sm:inline">
                {dictionary.navbar.chatbotAi}
              </span>
            </div>

            {!chatStarted ? (<div className="flex flex-1 items-center justify-center px-5">
                <div className="max-w-xl text-center">
                  <h2 className="text-2xl font-semibold text-zinc-100">
                    {locale === "pl"
                    ? "Witaj w Chatbot - SafeClickAI"
                    : "Welcome to Chatbot - SafeClickAI"}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    {locale === "pl"
                    ? "Zadaj pierwsze pytanie, aby uruchomić czat."
                    : "Ask your first question to start the chat."}
                  </p>
                </div>
              </div>) : (<div className="chatbot-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((message) => (<div key={message.id} className={`w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.role === "user"
                        ? "ml-auto bg-blue-500/20 text-blue-100"
                        : "bg-zinc-800 text-zinc-100"}`}>
                    {message.fileName ? (<div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-100/95">
                        <Paperclip className="size-3.5 shrink-0 opacity-90" aria-hidden/>
                        <span className="min-w-0 break-all">{message.fileName}</span>
                      </div>) : null}
                    {message.role === "assistant" && message.content === "" ? (<AssistantTyping searchingWeb={message.searchingWeb} locale={locale}/>) : message.content ? (message.role === "assistant" ? (<AssistantMarkdown content={message.content}/>) : (<div className="whitespace-pre-wrap">{message.content}</div>)) : null}
                    {message.role === "assistant" && message.sources && message.sources.length > 0 ? (<div className="mt-2 border-t border-zinc-700/80 pt-2">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-500">
                          <Globe className="size-3 shrink-0" aria-hidden/>
                          {locale === "pl" ? "Źródła" : "Sources"}
                        </div>
                        <ul className="flex flex-col gap-0.5 text-[11px]">
                          {message.sources.map((s, i) => (<li key={`${message.id}-src-${i}`} className="truncate">
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" title={s.url}>
                                {s.title || getHostname(s.url)}
                              </a>
                              <span className="ml-1 text-zinc-500">
                                ({getHostname(s.url)})
                              </span>
                            </li>))}
                        </ul>
                      </div>) : null}
                    {message.model ? (<div className="mt-2 border-t border-zinc-700/80 pt-2 text-[11px] text-zinc-500">
                        {message.model}
                      </div>) : null}
                  </div>))}
              </div>)}

            <form onSubmit={onSubmit} className="border-t border-zinc-800 p-3">
              <input ref={fileInputRef} type="file" className="sr-only" tabIndex={-1} onChange={onFileChange}/>
              {pendingFile ? (<div className="mb-2 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/90 px-2.5 py-2 text-xs text-zinc-300">
                  <Paperclip className="size-3.5 shrink-0 text-zinc-400" aria-hidden/>
                  <span className="min-w-0 flex-1 truncate" title={pendingFile.name}>
                    {pendingFile.name}
                  </span>
                  <button type="button" onClick={() => {
                    setPendingFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }} className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100" aria-label={locale === "pl" ? "Usuń załącznik" : "Remove attachment"}>
                    <X className="size-3.5"/>
                  </button>
                </div>) : null}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-11 w-11 shrink-0 cursor-pointer border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white [&_svg]:text-white" aria-label={locale === "pl" ? "Dodaj plik" : "Attach file"} onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="size-4 text-white"/>
                </Button>
                <Button type="button" variant="outline" size="icon" aria-pressed={webSearchEnabled} aria-label={locale === "pl"
                ? webSearchEnabled
                    ? "Wyszukiwanie w sieci włączone"
                    : "Włącz wyszukiwanie w sieci"
                : webSearchEnabled
                    ? "Web search enabled"
                    : "Enable web search"} title={locale === "pl"
                ? webSearchEnabled
                    ? "Wyszukiwanie w sieci: WŁ"
                    : "Wyszukiwanie w sieci: WYŁ"
                : webSearchEnabled
                    ? "Web search: ON"
                    : "Web search: OFF"} onClick={() => setWebSearchEnabled((v) => !v)} className={`h-11 w-11 shrink-0 cursor-pointer border-zinc-700 ${webSearchEnabled
                ? "bg-blue-500/20 text-blue-200 hover:bg-blue-500/25 [&_svg]:text-blue-200"
                : "bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white [&_svg]:text-white"}`}>
                  <Globe className="size-4"/>
                </Button>
                <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={locale === "pl" ? "Wpisz prompt..." : "Type a prompt..."} className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none placeholder:text-zinc-500 focus:border-blue-500/60"/>
                <Button type="submit" disabled={isSending} className="h-11 cursor-pointer bg-blue-500 text-zinc-100 hover:bg-blue-500/90 disabled:opacity-60">
                  <Send className="size-4"/>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>);
}
