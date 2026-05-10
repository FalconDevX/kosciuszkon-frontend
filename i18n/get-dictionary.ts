import type { Locale } from "./config";
import type { Dictionary } from "./types";
const dictionaries: Record<Locale, () => Promise<{
    default: Dictionary;
}>> = {
    en: () => import("@/messages/en.json"),
    pl: () => import("@/messages/pl.json"),
};
export async function getDictionary(locale: Locale) {
    const dictionary = await dictionaries[locale]();
    return dictionary.default;
}
