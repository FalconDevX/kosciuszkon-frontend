"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { useCurrentUser } from "@/lib/use-current-user";
type NavbarProps = {
    locale: Locale;
    dictionary: Dictionary;
};
export function Navbar({ locale, dictionary }: NavbarProps) {
    const pathname = usePathname();
    const { userId, username, isLoading } = useCurrentUser();
    const pathWithoutLocale = pathname.replace(/^\/(en|pl)(?=\/|$)/, "") || "/";
    const navigationItems = [
        { href: "/dashboard", label: dictionary.navbar.dashboard },
        { href: "/chatbot-ai", label: dictionary.navbar.chatbotAi },
        { href: "/wiki-concepts", label: dictionary.navbar.wikiConcepts },
        { href: "/interactive-tests", label: dictionary.navbar.interactiveTests },
        { href: "/quiz", label: dictionary.navbar.quiz },
    ];
    const languageOptions: Array<{
        code: Locale;
        flagSrc: string;
        label: string;
    }> = [
        { code: "en", flagSrc: "/en_flag.svg", label: dictionary.navbar.english },
        { code: "pl", flagSrc: "/pl_flag.svg", label: dictionary.navbar.polish },
    ];
    const displayName = username ?? userId ?? "";
    return (<header className="relative z-10 flex h-16 w-full items-center justify-between border-b border-zinc-800/90 bg-zinc-900/70 px-8 backdrop-blur">
      <Link href={`/${locale}`} className="flex items-center gap-3">
        <Image src="/safe_click_dark_small.png" alt="SafeClick shield logo" width={36} height={36} className="h-9 w-9" priority/>
        <Image src="/safe_click_dark_title.png" alt="SafeClick title" width={220} height={52} className="h-8 w-auto" priority/>
      </Link>
      <nav className="hidden items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/70 p-1 md:flex">
        {navigationItems.map((item) => {
            const isActive = pathWithoutLocale === item.href;
            return (<Link key={item.href} href={`/${locale}${item.href}`} className={`rounded px-3 py-1.5 text-sm transition-colors ${isActive
                    ? "bg-blue-500/28 text-blue-50"
                    : "text-zinc-300 hover:bg-blue-500/16 hover:text-blue-100"}`}>
              {item.label}
            </Link>);
        })}
      </nav>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-md border border-blue-500/35 bg-blue-950/35 p-1 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]">
          {languageOptions.map((option) => {
            const isActive = option.code === locale;
            return (<Link key={option.code} href={`/${option.code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`} className={`flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors ${isActive
                    ? "bg-blue-500/35 text-blue-50"
                    : "text-blue-200/80 hover:bg-blue-500/20 hover:text-blue-50"}`}>
                <Image src={option.flagSrc} alt={option.label} width={16} height={16} className="h-5 w-5 rounded-[2px]"/>
                <span>{option.code.toUpperCase()}</span>
              </Link>);
        })}
        </div>

        {isLoading ? (<div className="h-9 w-24 animate-pulse rounded-md border border-zinc-800 bg-zinc-900/60"/>) : userId ? (<div className="flex h-9 max-w-44 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 text-sm text-zinc-200" title={displayName}>
            <User className="size-4 shrink-0 text-zinc-300" aria-hidden/>
            <span className="truncate">{displayName}</span>
          </div>) : null}
      </div>
    </header>);
}
