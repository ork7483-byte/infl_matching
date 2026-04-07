import type { Metadata } from "next";
import EngagementRateToolPage from "./EngagementRateToolPage";

export const metadata: Metadata = {
  title: "인스타그램 참여율 계산기 — 무료 ER 분석 | Inflix",
  description:
    "인스타그램 계정의 참여율을 무료로 계산하세요. 사용자명만 입력하면 즉시 분석.",
};

export default function Page() {
  return <EngagementRateToolPage />;
}
