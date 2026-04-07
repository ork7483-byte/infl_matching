import type { Metadata } from "next";
import PriceCalculatorPage from "./PriceCalculatorPage";

export const metadata: Metadata = {
  title: "인플루언서 광고 단가 계산기 — 무료 예상 단가 분석 | Inflix",
  description:
    "인플루언서 팔로워 수와 카테고리로 예상 광고 단가를 무료로 계산하세요. 업계 표준 시장 가격표 제공.",
};

export default function Page() {
  return <PriceCalculatorPage />;
}
