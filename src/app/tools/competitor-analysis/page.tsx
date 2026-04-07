import type { Metadata } from "next";
import CompetitorAnalysisPage from "./CompetitorAnalysisPage";

export const metadata: Metadata = {
  title: "경쟁사 인플루언서 마케팅 분석 — 무료 | Inflix",
  description:
    "경쟁사 브랜드의 인플루언서 마케팅 전략을 분석하세요. 협업 인플루언서 목록, 예상 광고비, 주력 카테고리를 확인할 수 있습니다.",
};

export default function Page() {
  return <CompetitorAnalysisPage />;
}
