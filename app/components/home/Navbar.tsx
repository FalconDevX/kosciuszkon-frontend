"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type NavbarProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Navbar({ locale, dictionary }: NavbarProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(en|pl)(?=\/|$)/, "") || "/";

  const languageOptions: Array<{ code: Locale; flagSrc: string; label: string }> = [
    { code: "en", flagSrc: "/en_flag.svg", label: dictionary.navbar.english },
    { code: "pl", flagSrc: "/pl_flag.svg", label: dictionary.navbar.polish },
  ];

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-zinc-800/90 bg-zinc-900/70 px-8 backdrop-blur">
      <div className="flex items-center gap-3">
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
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/90 p-1">
          {languageOptions.map((option) => {
            const isActive = option.code === locale;
            return (
              <Link
                key={option.code}
                href={`/${option.code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
                className={`flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-500/20 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
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
      </div>
    </header>
  );
}
