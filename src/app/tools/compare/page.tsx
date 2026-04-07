import type { Metadata } from "next";
import ComparePage from "./ComparePage";

export const metadata: Metadata = {
  title: "인플루언서 비교 분석 — 무료 | Inflix",
  description:
    "인플루언서 2~5명을 나란히 비교하세요. 팔로워, 참여율, AQS를 한눈에.",
};

export default function Page() {
  return <ComparePage />;
}
