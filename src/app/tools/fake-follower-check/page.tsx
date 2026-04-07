import type { Metadata } from "next";
import FakeFollowerCheckPage from "./FakeFollowerCheckPage";

export const metadata: Metadata = {
  title: "인스타그램 가짜 팔로워 체크 — 무료 진성 팔로워 분석 | Inflix",
  description:
    "인스타그램 계정의 가짜 팔로워 비율을 무료로 확인하세요. 사용자명만 입력하면 즉시 판정.",
};

export default function Page() {
  return <FakeFollowerCheckPage />;
}
