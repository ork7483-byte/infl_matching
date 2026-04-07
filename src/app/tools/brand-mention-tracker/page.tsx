import type { Metadata } from "next";
import BrandMentionTrackerPage from "./BrandMentionTrackerPage";

export const metadata: Metadata = {
  title: "브랜드 멘션 모니터링 — 무료 | Inflix",
  description: "브랜드명 또는 해시태그가 인스타그램에서 얼마나 언급되는지 무료로 추적하세요. 일별 멘션 트렌드, 감정 분석, 영향력 있는 멘션 TOP 5를 제공합니다.",
};

export default function Page() {
  return <BrandMentionTrackerPage />;
}
