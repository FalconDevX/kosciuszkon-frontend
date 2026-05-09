import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const title = "SafeClick — Kościuszkon";
const description =
  "Master cybersecurity and stay one step ahead of threats. Quizzes, wiki, and SafeClick AI assistant.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${title}`,
  },
  description,
  icons: {
    icon: [{ url: "/safe_click_dark_small.png", type: "image/png" }],
    shortcut: "/safe_click_dark_small.png",
    apple: "/safe_click_dark_small.png",
  },
  openGraph: {
    title,
    description,
    siteName: title,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/safe_click_dark.png",
        alt: "SafeClick",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/safe_click_dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
