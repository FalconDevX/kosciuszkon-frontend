import { SettingsPage } from "@/app/components/settings/SettingsPage";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
type PageProps = {
    params: Promise<{
        locale: string;
    }>;
};
export default async function SettingsRoutePage({ params }: PageProps) {
    const { locale } = await params;
    if (!isLocale(locale)) {
        notFound();
    }
    const dictionary = await getDictionary(locale as Locale);
    return <SettingsPage locale={locale as Locale} dictionary={dictionary}/>;
}
