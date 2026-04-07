import type { Metadata } from "next";
import HashtagAnalyzerPage from "./HashtagAnalyzerPage";

export const metadata: Metadata = {
  title: "인스타그램 해시태그 분석기 — 무료 | Inflix",
  description:
    "인스타그램 해시태그의 게시물 수, 경쟁 난이도, 관련 해시태그를 무료로 분석하세요.",
};

export default function Page() {
  return <HashtagAnalyzerPage />;
}
