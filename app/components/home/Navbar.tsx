"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { useCurrentUser } from "@/lib/use-current-user";
import { logoutUser } from "@/services/api/auth-api";

type NavbarProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Navbar({ locale, dictionary }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userId, username, isLoading } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setMenuOpen(false);
      router.push(`/${locale}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const pathWithoutLocale = pathname.replace(/^\/(en|pl)(?=\/|$)/, "") || "/";
  const navigationItems = [
    { href: "/dashboard", label: dictionary.navbar.dashboard },
    { href: "/chatbot-ai", label: dictionary.navbar.chatbotAi },
    { href: "/wiki-concepts", label: dictionary.navbar.wikiConcepts },
    { href: "/interactive-tests", label: dictionary.navbar.interactiveTests },
    { href: "/quiz", label: dictionary.navbar.quiz },
  ];

  const languageOptions: Array<{ code: Locale; flagSrc: string; label: string }> = [
    { code: "en", flagSrc: "/en_flag.svg", label: dictionary.navbar.english },
    { code: "pl", flagSrc: "/pl_flag.svg", label: dictionary.navbar.polish },
  ];

  const displayName = username ?? userId ?? "";

  return (
    <header className="relative z-10 flex h-16 w-full items-center justify-between border-b border-zinc-800/90 bg-zinc-900/70 px-8 backdrop-blur">
      <Link href={`/${locale}`} className="flex items-center gap-3">
        <Image
          src="/safe_click_dark_small.png"
          alt="SafeClick shield logo"
          width={36}
          height={36}
          className="h-9 w-9"
          priority
        />
        <Image
          src="/safe_click_dark_title.png"
          alt="SafeClick title"
          width={220}
          height={52}
          className="h-8 w-auto"
          priority
        />
      </Link>
      <nav className="hidden items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/70 p-1 md:flex">
        {navigationItems.map((item) => {
          const isActive = pathWithoutLocale === item.href;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-blue-500/28 text-blue-50"
                  : "text-zinc-300 hover:bg-blue-500/16 hover:text-blue-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-md border border-blue-500/35 bg-blue-950/35 p-1 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]">
          {languageOptions.map((option) => {
            const isActive = option.code === locale;
            return (
              <Link
                key={option.code}
                href={`/${option.code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
                className={`flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-500/35 text-blue-50"
                    : "text-blue-200/80 hover:bg-blue-500/20 hover:text-blue-50"
                }`}
              >
                <Image
                  src={option.flagSrc}
                  alt={option.label}
                  width={16}
                  height={16}
                  className="h-5 w-5 rounded-[2px]"
                />
                <span>{option.code.toUpperCase()}</span>
              </Link>
            );
          })}
        </div>

        {isLoading ? (
          <div className="h-9 w-24 animate-pulse rounded-md border border-zinc-800 bg-zinc-900/60" />
        ) : userId ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 text-sm text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
            >
              <User className="size-4 text-zinc-300" aria-hidden />
              <span className="max-w-40 truncate">{displayName}</span>
            </button>
            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900/95 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur"
              >
                <div className="border-b border-zinc-800 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                    {dictionary.navbar.signedInAs}
                  </p>
                  <p className="truncate text-sm text-zinc-200">{displayName}</p>
                </div>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 transition-colors hover:bg-rose-500/15 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="size-4" aria-hidden />
                  {isLoggingOut
                    ? dictionary.navbar.loggingOut
                    : dictionary.navbar.logout}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Link
            href={`/${locale}`}
            className="flex h-9 items-center gap-2 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 text-sm text-blue-100 transition-colors hover:border-blue-500/60 hover:bg-blue-500/20"
          >
            <LogIn className="size-4" aria-hidden />
            {dictionary.navbar.login}
          </Link>
        )}
      </div>
    </header>
  );
}
