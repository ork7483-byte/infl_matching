import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "인플릭스 (Inflix) — AI 기반 인플루언서 마케팅 플랫폼",
  description:
    "데이터로 검증된 인플루언서를 찾고, 캠페인 성과를 추적하세요. AI 기반 인플루언서 분석·매칭·캠페인 관리 플랫폼.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={`${inter.className} bg-white text-[#111827] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
