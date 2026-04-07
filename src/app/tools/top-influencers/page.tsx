import type { Metadata } from "next";
import TopInfluencersPage from "./TopInfluencersPage";

export const metadata: Metadata = {
  title: "카테고리별 인기 인플루언서 TOP 100 — 무료 | Inflix",
  description: "카테고리별 인기 인플루언서 순위를 확인하세요.",
};

export default function Page() {
  return <TopInfluencersPage />;
}
