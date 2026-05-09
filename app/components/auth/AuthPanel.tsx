"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearStoredUserId } from "@/lib/auth-storage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { Login } from "./Login";
import { Register } from "./Register";

type AuthPanelProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function AuthPanel({ dictionary, locale }: AuthPanelProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/75 p-7 shadow-[0_24px_70px_-38px_rgba(37,99,235,0.5)] backdrop-blur-xl">
      <p className="mb-2 text-xs font-medium tracking-[0.18em] text-blue-300/80 uppercase">
        {dictionary.auth.panelTag}
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
        {authMode === "login"
          ? dictionary.auth.loginTitle
          : dictionary.auth.registerTitle}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {authMode === "login"
          ? dictionary.auth.loginSubtitle
          : dictionary.auth.registerSubtitle}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg bg-zinc-950/80 p-1">
        <Button
          type="button"
          variant={authMode === "login" ? "default" : "ghost"}
          className={`cursor-pointer ${
            authMode === "login"
              ? "bg-blue-500 text-zinc-950 hover:bg-blue-400"
              : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          }`}
          onClick={() => setAuthMode("login")}
        >
          {dictionary.auth.loginTab}
        </Button>
        <Button
          type="button"
          variant={authMode === "register" ? "default" : "ghost"}
          className={`cursor-pointer ${
            authMode === "register"
              ? "bg-blue-500 text-zinc-950 hover:bg-blue-400"
              : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          }`}
          onClick={() => setAuthMode("register")}
        >
          {dictionary.auth.registerTab}
        </Button>
      </div>
      {authMode === "login" ? (
        <Login dictionary={dictionary} locale={locale} />
      ) : (
        <Register dictionary={dictionary} locale={locale} />
      )}
      <Button
        type="button"
        variant="ghost"
        className="mt-3 w-full cursor-pointer text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
        onClick={() => {
          clearStoredUserId();
          router.push(`/${locale}/dashboard`);
        }}
      >
        {dictionary.auth.continueWithoutRegister}
      </Button>
    </div>
  );
}
