import type { Metadata } from "next";
import FollowerCountPage from "./FollowerCountPage";

export const metadata: Metadata = {
  title: "인스타그램 팔로워 수 실시간 확인 — 무료 | Inflix",
  description:
    "인스타그램 계정의 팔로워, 팔로잉, 게시물 수를 실시간으로 확인하세요.",
};

export default function Page() {
  return <FollowerCountPage />;
}
