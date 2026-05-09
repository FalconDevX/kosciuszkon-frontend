import {
  Bot,
  Building,
  Globe,
  KeyRound,
  MailWarning,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { QuizCategory, QuizDifficulty } from "@/types/quiz";

export type CategoryMeta = {
  category: QuizCategory;
  title: string;
  icon: LucideIcon;
  description: string;
  difficulty: QuizDifficulty;
  quizCount: number;
  estimatedTime: string;
};

export const categoryMetadata: CategoryMeta[] = [
  {
    category: "Phishing",
    title: "Phishing",
    icon: MailWarning,
    description: "Fake emails, suspicious links, and social engineering.",
    difficulty: "Medium",
    quizCount: 5,
    estimatedTime: "5 min",
  },
  {
    category: "Password Security",
    title: "Password Security",
    icon: KeyRound,
    description: "Strong passwords, MFA, and credential leak defense.",
    difficulty: "Beginner",
    quizCount: 5,
    estimatedTime: "5 min",
  },
  {
    category: "Web Security",
    title: "Web Security",
    icon: Globe,
    description: "Unsafe websites, browser attacks, and downloads.",
    difficulty: "Medium",
    quizCount: 5,
    estimatedTime: "5 min",
  },
  {
    category: "Workplace Security",
    title: "Workplace Security",
    icon: Building,
    description: "Corporate threats, insider risk, and device safety.",
    difficulty: "Advanced",
    quizCount: 5,
    estimatedTime: "5 min",
  },
  {
    category: "AI Threats",
    title: "AI & Modern Threats",
    icon: Bot,
    description: "Deepfakes, AI scams, and modern phishing patterns.",
    difficulty: "Advanced",
    quizCount: 5,
    estimatedTime: "5 min",
  },
  {
    category: "Password Security",
    title: "Beginner / Advanced",
    icon: ShieldCheck,
    description: "Adaptive starter and advanced challenge sets.",
    difficulty: "Mixed",
    quizCount: 5,
    estimatedTime: "5 min",
  },
];
