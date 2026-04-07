import type { Metadata } from "next";
import RoiCalculatorPage from "./RoiCalculatorPage";

export const metadata: Metadata = {
  title: "인플루언서 마케팅 ROI 계산기 — 무료 | Inflix",
  description:
    "인플루언서 마케팅 예산의 예상 ROI를 미리 계산해보세요.",
};

export default function Page() {
  return <RoiCalculatorPage />;
}
