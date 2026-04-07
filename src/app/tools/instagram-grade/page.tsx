import type { Metadata } from "next";
import InstagramGradePage from "./InstagramGradePage";

export const metadata: Metadata = {
  title: "내 Instagram 알고리즘 등급은? — 무료 확인 | Inflix",
  description:
    "Instagram 계정의 알고리즘 등급을 무료로 확인하세요. S/A/B/C/D 등급으로 노출 상태를 알려드립니다.",
};

export default function Page() {
  return <InstagramGradePage />;
}
