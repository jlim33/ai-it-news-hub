import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI & IT 펄스 | 실시간 AI & IT 뉴스 및 AI 브리핑",
  description:
    "국내외 인공지능, LLM, 반도체, 사이버 보안, 클라우드 기술 뉴스를 24시간 실시간으로 자동 수집하고 AI 핵심 요약 및 커뮤니티 토론을 제공하는 테크 미디어 플랫폼",
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
    <html lang="ko">
      <body className="min-h-screen antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
