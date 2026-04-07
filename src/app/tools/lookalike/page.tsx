import type { Metadata } from "next";
import LookalikePage from "./LookalikePage";

export const metadata: Metadata = {
  title: "비슷한 인플루언서 찾기 — 무료 | Inflix",
  description: "특정 인플루언서와 유사한 인플루언서를 카테고리, 팔로워 규모, 참여율 기준으로 무료로 찾아보세요.",
};

export default function Page() {
  return <LookalikePage />;
}
