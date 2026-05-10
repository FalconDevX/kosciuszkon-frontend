import type { LucideIcon } from "lucide-react";
export type DangerLevel = "Low" | "Medium" | "High" | "Critical";
export type WikiCategory = {
    id: string;
    label: string;
    icon: LucideIcon;
};
export type WikiArticle = {
    id: string;
    title: string;
    category: string;
    readingTime: string;
    dangerLevel: DangerLevel;
    description: string;
    howItWorks: string[];
    examples: string[];
    redFlags: string[];
    preventionTips: string[];
    relatedTopics: string[];
};
