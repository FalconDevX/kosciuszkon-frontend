import { ChatbotPage } from "@/app/components/chatbot/ChatbotPage";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ChatbotAiPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);
  return <ChatbotPage locale={locale} dictionary={dictionary} />;
}
