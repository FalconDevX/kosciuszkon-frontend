import { BadgeAlert, Bot, Briefcase, Bug, Cloud, Fingerprint, Globe, KeyRound, MailWarning, Network, Radio, ScanSearch, ServerCog, Shield, ShieldCheck, Smartphone, Target, Workflow, } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { WikiArticle, WikiCategory } from "@/types/wiki";
import { wikiArticlesEn } from "@/services/wiki/articles.en";
import { wikiArticlesPl } from "@/services/wiki/articles.pl";
type WikiCategoryDef = {
    id: string;
    icon: LucideIcon;
};
const wikiCategoryDefs: WikiCategoryDef[] = [
    { id: "phishing", icon: MailWarning },
    { id: "password-security", icon: KeyRound },
    { id: "web-security", icon: Globe },
    { id: "malware", icon: Bug },
    { id: "ai-threats", icon: Bot },
    { id: "workplace-security", icon: Briefcase },
    { id: "mobile-security", icon: Smartphone },
    { id: "cloud-security", icon: Cloud },
    { id: "privacy", icon: ShieldCheck },
    { id: "social-engineering", icon: BadgeAlert },
    { id: "network-security", icon: Network },
    { id: "incident-response", icon: Shield },
    { id: "identity-access", icon: Fingerprint },
    { id: "devsecops", icon: Workflow },
    { id: "email-security", icon: MailWarning },
    { id: "iot-security", icon: Radio },
    { id: "endpoint-security", icon: Smartphone },
    { id: "threat-intelligence", icon: ScanSearch },
    { id: "application-security", icon: ServerCog },
    { id: "cryptography", icon: KeyRound },
    { id: "security-awareness", icon: Target },
];
const wikiCategoryLabels: Record<Locale, Record<string, string>> = {
    en: {
        phishing: "Phishing",
        "password-security": "Password Security",
        "web-security": "Web Security",
        malware: "Malware",
        "ai-threats": "AI Threats",
        "workplace-security": "Workplace Security",
        "mobile-security": "Mobile Security",
        "cloud-security": "Cloud Security",
        privacy: "Privacy",
        "social-engineering": "Social Engineering",
        "network-security": "Network Security",
        "incident-response": "Incident Response",
        "identity-access": "Identity & Access",
        devsecops: "DevSecOps",
        "email-security": "Email Security",
        "iot-security": "IoT Security",
        "endpoint-security": "Endpoint Security",
        "threat-intelligence": "Threat Intelligence",
        "application-security": "Application Security",
        cryptography: "Cryptography",
        "security-awareness": "Security Awareness",
    },
    pl: {
        phishing: "Phishing",
        "password-security": "Bezpieczeństwo haseł",
        "web-security": "Bezpieczeństwo WWW",
        malware: "Malware",
        "ai-threats": "Zagrożenia AI",
        "workplace-security": "Bezpieczeństwo w pracy",
        "mobile-security": "Bezpieczeństwo mobilne",
        "cloud-security": "Bezpieczeństwo chmury",
        privacy: "Prywatność",
        "social-engineering": "Inżynieria społeczna",
        "network-security": "Bezpieczeństwo sieci",
        "incident-response": "Reagowanie na incydenty",
        "identity-access": "Tożsamość i dostęp",
        devsecops: "DevSecOps",
        "email-security": "Bezpieczeństwo e-mail",
        "iot-security": "Bezpieczeństwo IoT",
        "endpoint-security": "Endpointy",
        "threat-intelligence": "Threat intelligence",
        "application-security": "Bezpieczeństwo aplikacji",
        cryptography: "Kryptografia",
        "security-awareness": "Świadomość bezpieczeństwa",
    },
};
const wikiArticlesByLocale: Record<Locale, WikiArticle[]> = {
    en: wikiArticlesEn,
    pl: wikiArticlesPl,
};
export function getWikiCategories(locale: Locale): WikiCategory[] {
    const labels = wikiCategoryLabels[locale];
    return wikiCategoryDefs.map((def) => ({
        id: def.id,
        icon: def.icon,
        label: labels[def.id] ?? def.id,
    }));
}
export function getWikiArticles(locale: Locale): WikiArticle[] {
    return wikiArticlesByLocale[locale];
}
