import type { Metadata } from "next";
import CampaignBriefTemplatePage from "./CampaignBriefTemplatePage";

export const metadata: Metadata = {
  title: "캠페인 브리프 템플릿 — 무료 다운로드 | Inflix",
  description:
    "인플루언서 마케팅 캠페인 브리프를 쉽게 작성하세요. 양식에 맞춰 입력하면 PDF로 다운로드할 수 있습니다.",
};

export default function Page() {
  return <CampaignBriefTemplatePage />;
}
