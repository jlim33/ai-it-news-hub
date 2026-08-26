import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType
} from "docx";
import fs from "fs";
import path from "path";

async function createProjectDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Main Title
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "⚡ AI & IT News Pulse — 개발 및 대화 기록 보고서",
                bold: true,
                size: 36,
                color: "1F4E79",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "실시간 AI & IT 뉴스 자동 수집 및 AI 브리핑 플랫폼 개발 전 과정 기록",
                italics: true,
                size: 22,
                color: "595959",
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "F2F4F7" },
                    children: [new Paragraph({ children: [new TextRun({ text: "프로젝트명", bold: true })] })],
                  }),
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "AI & IT News Pulse (ai-it-news-hub)" })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F4F7" },
                    children: [new Paragraph({ children: [new TextRun({ text: "공식 배포 주소", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "https://ai-it-news-hub.vercel.app" })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F4F7" },
                    children: [new Paragraph({ children: [new TextRun({ text: "GitHub 저장소", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "https://github.com/jlim33/ai-it-news-hub" })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F4F7" },
                    children: [new Paragraph({ children: [new TextRun({ text: "작성일자", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 400 } }),

          // Section 1: Executive Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [new TextRun({ text: "1. 프로젝트 개요 및 완성 결과", bold: true, color: "1F4E79" })],
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "본 프로젝트는 인공지능(AI) 및 정보기술(IT) 분야의 최신 뉴스와 연구 논문, 테크 기업 소식을 실시간으로 자동 수집(Auto-Updating)하고, AI 기반 요약과 음성 읽어주기(TTS), 뉴스레터 자동 발행 기능을 제공하는 반응형 웹 플랫폼 개발을 목표로 진행되었습니다.",
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "실시간 멀티 소스 피드 수집: ", bold: true }),
              new TextRun("arXiv AI/NLP 연구 논문, OpenAI, DeepMind, TechCrunch, The Verge, Hacker News 등 15개 이상의 핵심 피드를 15분 주기로 자동 수집 및 중복 제거 캐싱."),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "AI 인텔리전스 요약: ", bold: true }),
              new TextRun("기사별 핵심 3줄 요약(TL;DR), 중요성 분석(Why It Matters), 영향도(Impact: Critical/High/Medium/Low) 및 감성 분석을 자동 제공."),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "음성 브리핑 (Web Speech TTS): ", bold: true }),
              new TextRun("기사 내용 및 AI 요약을 웹 브라우저 음성으로 직접 들을 수 있는 오디오 플레이어 탑재."),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Formspree 뉴스레터 연동: ", bold: true }),
              new TextRun("일일 뉴스 브리핑을 Formspree 엔드포인트(https://formspree.io/f/xgawgzrv)로 원클릭 발행/전송하는 기능 구현."),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "글로벌 클라우드 배포: ", bold: true }),
              new TextRun("GitHub(jlim33/ai-it-news-hub) 연동 및 Vercel 프로덕션 배포 완료로 전 세계 누구나 24시간 접속 가능."),
            ],
          }),

          // Section 2: Full Conversation & Step-by-Step History
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [new TextRun({ text: "2. 대화 및 개발 진행 상세 기록 (Timeline)", bold: true, color: "1F4E79" })],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: "단계 1: 요구사항 정의 및 구현 계획 수립", bold: true })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 사용자 요청: ", bold: true }),
              new TextRun('"I would like to build web site for auto updating AI & IT News"'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 조치 내용: ", bold: true }),
              new TextRun("Next.js 14, React, Tailwind CSS 기반의 아키텍처를 설계하고, RSS/Atom 파서, AI 요약 엔진, 반응형 UI 컴포넌트 구조를 담은 Implementation Plan을 작성하여 승인을 받음."),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: "단계 2: 프론트엔드/백엔드 풀스택 구축 및 검증", bold: true })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 핵심 구현: ", bold: true }),
              new TextRun("실시간 피드 파서(feedFetcher.ts), 휴리스틱 및 Gemini AI 요약기(aiSummarizer.ts), 헤더, 실시간 속보 전광판(BreakingTicker), 히어로 카드(HeroFeatured), 카테고리 필터(CategoryNav), 기사 상세 모달(ArticleModal), 피드 관리자(FeedManagerModal), 북마크 서랍(BookmarksDrawer) 완성."),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 테스트 검증: ", bold: true }),
              new TextRun("arXiv, TechCrunch, Hacker News 피드 실시간 수집(300건 이상) 및 API 엔드포인트(/api/news, /api/summarize, /api/feeds) 100% 정상 작동 검증 완료."),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: "단계 3: Formspree 이메일/웹훅 시험 발행", bold: true })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 사용자 요청: ", bold: true }),
              new TextRun('"이 템플렛을 시험용으로 https://formspree.io/f/xgawgzrv 통해서 publish 해 줄 수 있어?"'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 조치 내용: ", bold: true }),
              new TextRun("오늘의 주요 5대 AI/IT 기사 요약 브리핑을 Formspree 엔드포인트로 즉시 전송(200 OK 응답 확인)하였으며, 웹 UI의 AI Briefing 모달에서도 언제든 원클릭으로 발행할 수 있는 버튼을 연동함."),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: "단계 4: GitHub 업로드 및 Vercel 배포 트러블슈팅", bold: true })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• GitHub 연동: ", bold: true }),
              new TextRun("사용자 저장소(https://github.com/jlim33/ai-it-news-hub)에 전체 36개 소스코드 푸시 완료."),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• 404 에러 및 빌드 에러 해결: ", bold: true }),
              new TextRun("1) 초기에 빈 저장소로 Vercel 프로젝트가 생성되어 'Other' 프레임워크로 지정되었던 문제를 vercel.json(framework: nextjs)으로 해결. 2) Vercel TypeScript 검사기에서 발생한 RSS 타입 불일치를 해결하여 프로덕션 빌드 성공(Ready Latest 🟢)."),
            ],
          }),

          // Section 3: Tech Stack & Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [new TextRun({ text: "3. 기술 스택 및 아키텍처", bold: true, color: "1F4E79" })],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Frontend: ", bold: true }),
              new TextRun("Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Date-fns\n"),
              new TextRun({ text: "• Backend/API: ", bold: true }),
              new TextRun("Next.js Route Handlers (/api/news, /api/news/sync, /api/summarize, /api/feeds)\n"),
              new TextRun({ text: "• Ingestion Engine: ", bold: true }),
              new TextRun("rss-parser, Memory/OS Tmp Cache Layer, Deduplication Logic\n"),
              new TextRun({ text: "• AI & Voice: ", bold: true }),
              new TextRun("Heuristic NLP Engine, Google Gemini API, Web Speech API (TTS)\n"),
              new TextRun({ text: "• Deployment & DevOps: ", bold: true }),
              new TextRun("GitHub Version Control, Vercel Serverless Edge Cloud\n"),
            ],
          }),

          // Section 4: How to Open in Google Docs
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [new TextRun({ text: "4. Google Docs(구글 문서)로 열고 저장하는 방법", bold: true, color: "1F4E79" })],
          }),

          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "1단계: ", bold: true }),
              new TextRun("Google Drive(https://drive.google.com)에 접속하여 로그인합니다."),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "2단계: ", bold: true }),
              new TextRun("생성된 본 파일(AI_IT_News_Hub_Project_Report.docx)을 구글 드라이브 화면으로 드래그 앤 드롭하여 업로드합니다."),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "3단계: ", bold: true }),
              new TextRun("업로드된 파일을 더블클릭하면 상단에 [Google Docs로 열기] 버튼이 나타나며, 클릭 시 구글 문서로 즉시 자동 변환 및 저장됩니다."),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(process.cwd(), "AI_IT_News_Hub_Project_Report.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ Word Document generated successfully at:", outputPath);
}

createProjectDoc();
