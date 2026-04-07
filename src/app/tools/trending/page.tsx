import type { Metadata } from "next";
import TrendingPage from "./TrendingPage";

export const metadata: Metadata = {
  title: "지금 뜨는 인플루언서 — 실시간 트렌딩 | Inflix",
  description: "이번 주 팔로워가 가장 빠르게 증가하는 트렌딩 인플루언서를 카테고리별로 확인하세요. 매주 월요일 업데이트됩니다.",
};

export default function Page() {
  return <TrendingPage />;
}
