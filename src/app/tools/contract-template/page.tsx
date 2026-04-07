import type { Metadata } from "next";
import ContractTemplatePage from "./ContractTemplatePage";

export const metadata: Metadata = {
  title: "인플루언서 계약서 템플릿 — 무료 다운로드 | Inflix",
  description:
    "인플루언서 협업 계약서 한국어 양식을 무료로 작성하세요. 광고 표시 의무, 콘텐츠 사용권, 보상 조건 등을 포함합니다.",
};

export default function Page() {
  return <ContractTemplatePage />;
}
