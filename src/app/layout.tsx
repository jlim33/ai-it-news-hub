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
        {/* ==================== UBIQUITARIAN BRAND BANNER ==================== */}
        <aside className="ubiquitarian-banner" style={{ background: 'linear-gradient(90deg, #090d16 0%, #111827 50%, #090d16 100%)', color: '#cbd5e1', fontSize: '12px', fontWeight: 600, textAlign: 'center', padding: '7px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 99999, position: 'relative', letterSpacing: '0.02em', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>🌐</span>
            <span>Powered by</span>
            <a href="https://www.ubiquitarian.info" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              Ubiquitarian.info
              <span style={{ fontSize: '10px', marginLeft: '2px' }}>↗</span>
            </a>
          </span>
        </aside>
        {children}
      </body>
    </html>
  );
}
