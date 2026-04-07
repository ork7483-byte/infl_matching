import type { Metadata } from "next";
import EmvCalculatorPage from "./EmvCalculatorPage";

export const metadata: Metadata = {
  title: "인플루언서 미디어 가치(EMV) 계산기 — 무료 | Inflix",
  description:
    "인플루언서 게시물 1건의 미디어 가치(EMV)를 무료로 계산하세요. 네이버·구글·페이스북 광고 대비 효율을 확인할 수 있습니다.",
};

export default function Page() {
  return <EmvCalculatorPage />;
}
