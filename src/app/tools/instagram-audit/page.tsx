import type { Metadata } from "next";
import InstagramAuditPage from "./InstagramAuditPage";

export const metadata: Metadata = {
  title: "인스타그램 계정 감사 — 무료 분석 리포트 | Inflix",
  description:
    "인스타그램 계정을 종합 분석하세요. AQS, 참여율, 가짜 팔로워까지.",
};

export default function Page() {
  return <InstagramAuditPage />;
}
