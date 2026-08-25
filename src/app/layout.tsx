import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI & IT News Pulse | Real-Time Auto-Updating Tech & AI Aggregator",
  description:
    "Real-time auto-updating news aggregation and AI-powered intelligence across Artificial Intelligence, LLMs, Hardware, Cybersecurity, Cloud, and IT.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
