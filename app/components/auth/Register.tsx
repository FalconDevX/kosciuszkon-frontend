import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { API_BASE_URL, getApiErrorMessage } from "@/lib/api";

const inputClassName =
  "h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-blue-500/70";

type RegisterProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function Register({ dictionary, locale }: RegisterProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(response);
        setStatus({ type: "error", message });
        return;
      }

      setStatus({ type: "success", message: "Registration successful." });
      router.push(`/${locale}/dashboard`);
    } catch {
      setStatus({
        type: "error",
        message: "Could not connect to API. Check network or backend availability.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder={dictionary.auth.username}
          className={inputClassName}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <input
          type="email"
          placeholder={dictionary.auth.email}
          className={inputClassName}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder={dictionary.auth.password}
          className={inputClassName}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder={dictionary.auth.confirmPassword}
          className={inputClassName}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-10 w-full cursor-pointer bg-blue-500 text-zinc-950 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : dictionary.auth.createAccount}
        </Button>
        {status ? (
          <p
            className={`text-xs ${
              status.type === "success" ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {status.message}
          </p>
        ) : null}
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
