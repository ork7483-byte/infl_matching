import type { Metadata } from "next";
import InfluencersByLocationPage from "./InfluencersByLocationPage";

export const metadata: Metadata = {
  title: "지역별 인플루언서 찾기 — 무료 | Inflix",
  description: "서울, 부산 등 지역별 인플루언서를 찾아보세요.",
};

export default function Page() {
  return <InfluencersByLocationPage />;
}
