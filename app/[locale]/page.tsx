import { Home } from "@/app/components/home/Home";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
type PageProps = {
    params: Promise<{
        locale: string;
    }>;
};
export default async function LocalizedPage({ params }: PageProps) {
    const { locale } = await params;
    if (!isLocale(locale)) {
        notFound();
    }
    const dictionary = await getDictionary(locale as Locale);
    return <Home locale={locale} dictionary={dictionary}/>;
}
