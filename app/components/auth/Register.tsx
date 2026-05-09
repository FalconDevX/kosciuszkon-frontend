import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Dictionary } from "@/i18n/types";

const inputClassName =
  "h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-500/70";

type RegisterProps = {
  dictionary: Dictionary;
};

export function Register({ dictionary }: RegisterProps) {
  return (
    <>
      <form className="mt-5 space-y-3">
        <input
          type="text"
          placeholder={dictionary.auth.username}
          className={inputClassName}
        />
        <input
          type="email"
          placeholder={dictionary.auth.email}
          className={inputClassName}
        />
        <input
          type="password"
          placeholder={dictionary.auth.password}
          className={inputClassName}
        />
        <input
          type="password"
          placeholder={dictionary.auth.confirmPassword}
          className={inputClassName}
        />
        <Button className="mt-1 h-10 w-full cursor-pointer bg-blue-500 text-zinc-950 hover:bg-blue-400">
          {dictionary.auth.createAccount}
        </Button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-xs text-zinc-500">{dictionary.auth.continueWith}</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white py-5 gap-2"
        >
          <Image
            src="/google_logo.svg"
            alt="Google"
            width={16}
            height={16}
            className="h-4 w-4"
          />
          {dictionary.auth.google}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white py-5 gap-2"
        >
          <Image
            src="/fb_logo.svg"
            alt="Facebook"
            width={16}
            height={16}
            className="h-4 w-4"
          />
          {dictionary.auth.facebook}
        </Button>
      </div>
    </>
  );
}
