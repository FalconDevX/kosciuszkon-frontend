import { QuizzesDashboard } from "@/app/components/quizzes/QuizzesDashboard";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
type PageProps = {
    params: Promise<{
        locale: string;
    }>;
};
export default async function QuizPage({ params }: PageProps) {
    const { locale } = await params;
    if (!isLocale(locale)) {
        notFound();
    }
    const dictionary = await getDictionary(locale as Locale);
    return <QuizzesDashboard locale={locale} dictionary={dictionary}/>;
}
