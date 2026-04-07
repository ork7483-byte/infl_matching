"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InfluencerValueReport from "@/components/InfluencerValueReport";

type ToolKey =
  | "instagram-audit"
  | "compare"
  | "engagement-rate"
  | "fake-follower-check"
  | "follower-count"
  | "top-influencers"
  | "influencers-by-location"
  | "trending"
  | "lookalike"
  | "instagram-grade"
  | "roi-calculator"
  | "emv-calculator"
  | "price-calculator"
  | "hashtag-analyzer"
  | "competitor-analysis"
  | "brand-mention-tracker"
  | "campaign-brief-template"
  | "contract-template";

interface ToolItem {
  key: ToolKey;
  title: string;
  description: string;
  group: string;
}

const TOOL_GROUPS: { name: string; tools: ToolItem[] }[] = [
  {
    name: "분석",
    tools: [
      { key: "instagram-audit", title: "프로필 감사", description: "Instagram 프로필을 심층 분석합니다. 팔로워 품질, 콘텐츠 성과, AQS 5축 점수를 한눈에 확인하세요.", group: "분석" },
      { key: "compare", title: "인플루언서 비교", description: "2명 이상의 인플루언서를 나란히 비교합니다. 팔로워 수, 참여율, 단가 효율을 바로 대조하세요.", group: "분석" },
      { key: "engagement-rate", title: "참여율 계산기", description: "게시물 평균 참여율을 자동 산출합니다. 카테고리 평균 대비 인플루언서의 실질적 영향력을 측정하세요.", group: "분석" },
      { key: "fake-follower-check", title: "가짜 팔로워 탐지", description: "AI가 봇·비활성 계정을 탐지합니다. 진성 팔로워 비율을 확인해 광고비 낭비를 방지하세요.", group: "분석" },
      { key: "follower-count", title: "팔로워 체크", description: "팔로워 추이를 추적합니다. 급격한 증감 패턴으로 이상 성장 여부를 확인하세요.", group: "분석" },
    ],
  },
  {
    name: "탐색",
    tools: [
      { key: "top-influencers", title: "랭킹", description: "카테고리·팔로워 수별 상위 인플루언서 순위를 제공합니다. 목적에 맞는 인플루언서를 빠르게 발견하세요.", group: "탐색" },
      { key: "influencers-by-location", title: "지역별 검색", description: "지역을 지정해 현지 인플루언서를 찾습니다. 로컬 캠페인에 최적화된 크리에이터를 매칭하세요.", group: "탐색" },
      { key: "trending", title: "트렌딩 콘텐츠", description: "현재 가장 빠르게 확산되는 콘텐츠 트렌드를 분석합니다. 캠페인 소재 발굴에 활용하세요.", group: "탐색" },
      { key: "lookalike", title: "유사 인플루언서", description: "기존 협업 인플루언서와 유사한 프로필을 자동으로 추천합니다. 후보군을 빠르게 확장하세요.", group: "탐색" },
      { key: "instagram-grade", title: "Instagram 등급", description: "Instagram 계정의 종합 등급(S~D)을 산출합니다. 협업 적합성을 한눈에 파악하세요.", group: "탐색" },
    ],
  },
  {
    name: "비용",
    tools: [
      { key: "roi-calculator", title: "ROI 계산기", description: "캠페인 집행 비용과 예상 도달·전환을 입력해 예상 ROI를 계산합니다. 예산 배분 결정에 활용하세요.", group: "비용" },
      { key: "emv-calculator", title: "EMV 계산기", description: "게시물 참여 데이터를 기반으로 미디어 가치(EMV)를 산출합니다. 인플루언서 캠페인의 광고 환산 가치를 확인하세요.", group: "비용" },
      { key: "price-calculator", title: "단가 계산기", description: "팔로워 수·참여율·콘텐츠 유형을 입력해 적정 단가 범위를 계산합니다. 협상 기준점을 잡으세요.", group: "비용" },
    ],
  },
  {
    name: "시장",
    tools: [
      { key: "hashtag-analyzer", title: "해시태그 분석", description: "특정 해시태그의 사용량, 경쟁도, 연관 태그를 분석합니다. 콘텐츠 전략에 최적 해시태그를 활용하세요.", group: "시장" },
      { key: "competitor-analysis", title: "경쟁사 분석", description: "경쟁 브랜드의 인플루언서 활용 현황을 분석합니다. 협업 패턴과 예산 전략을 파악하세요.", group: "시장" },
      { key: "brand-mention-tracker", title: "멘션 추적기", description: "소셜미디어 전반의 브랜드 멘션을 실시간 모니터링합니다. 긍·부정 분석과 인플루언서 반응을 추적하세요.", group: "시장" },
    ],
  },
  {
    name: "템플릿",
    tools: [
      { key: "campaign-brief-template", title: "캠페인 브리프", description: "인플루언서에게 전달할 캠페인 브리프를 빠르게 작성합니다. 구조화된 템플릿으로 커뮤니케이션 효율을 높이세요.", group: "템플릿" },
      { key: "contract-template", title: "계약서 템플릿", description: "인플루언서 협업 계약서를 자동 생성합니다. 법적 리스크를 줄이고 계약 프로세스를 간소화하세요.", group: "템플릿" },
    ],
  },
];

const ALL_TOOLS: ToolItem[] = TOOL_GROUPS.flatMap((g) => g.tools);

export default function ForBrandsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolKey>("instagram-audit");
  const currentTool = ALL_TOOLS.find((t) => t.key === selectedTool) ?? ALL_TOOLS[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9FAFB]">
        {/* Hero */}
        <section className="bg-white pt-28 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-[#7c3aed]/10 text-[#7c3aed] text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-[#7c3aed]/20">
              브랜드 솔루션
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#111827] mb-4 leading-tight">
              인플루언서 등급
            </h1>
            <p className="text-[#6B7280] text-base md:text-lg mb-10 max-w-xl mx-auto">
              협업 전에 AQS·IGR 기반 등급과 적정 단가를 무료로 확인하세요
            </p>
            <InfluencerValueReport mode="brand" />
          </div>
        </section>

        {/* More tools */}
        <section className="py-16 px-4 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-8">더 많은 분석 도구</h2>
            <div className="flex gap-6 items-start overflow-x-hidden">
              {/* Sidebar */}
              <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-24">
                <nav className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                  {TOOL_GROUPS.map((group) => (
                    <div key={group.name}>
                      <div className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider bg-[#F9FAFB] border-b border-[#F3F4F6]">
                        {group.name}
                      </div>
                      {group.tools.map((tool) => (
                        <button
                          key={tool.key}
                          onClick={() => setSelectedTool(tool.key)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-[#F3F4F6] last:border-b-0 cursor-pointer ${
                            selectedTool === tool.key
                              ? "bg-[#7c3aed]/8 text-[#7c3aed] font-semibold"
                              : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827]"
                          }`}
                          style={selectedTool === tool.key ? { backgroundColor: "rgba(124,58,237,0.08)" } : {}}
                        >
                          {tool.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </nav>
              </aside>

              {/* Mobile tool selector */}
              <div className="lg:hidden w-full mb-4">
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value as ToolKey)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] bg-white focus:outline-none focus:border-[#7c3aed] min-h-[48px]"
                >
                  {TOOL_GROUPS.map((group) => (
                    <optgroup key={group.name} label={group.name}>
                      {group.tools.map((tool) => (
                        <option key={tool.key} value={tool.key}>
                          {tool.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Tool card */}
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
                  <span className="text-xs font-semibold text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full mb-4 inline-block">
                    {currentTool.group}
                  </span>
                  <h3 className="text-2xl font-bold text-[#111827] mb-3">{currentTool.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed mb-8">{currentTool.description}</p>
                  <Link
                    href={`/tools/${currentTool.key}`}
                    className="inline-flex items-center gap-2 bg-[#7c3aed] text-white font-semibold px-6 py-3 rounded-xl text-base hover:opacity-90 transition-opacity min-h-[48px] cursor-pointer"
                  >
                    사용하기 →
                  </Link>
                </div>

                {/* Tool grid for current group */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TOOL_GROUPS.find((g) => g.name === currentTool.group)?.tools
                    .filter((t) => t.key !== currentTool.key)
                    .map((tool) => (
                      <button
                        key={tool.key}
                        onClick={() => setSelectedTool(tool.key)}
                        className="text-left bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#7c3aed]/50 transition-colors cursor-pointer"
                      >
                        <h4 className="text-sm font-semibold text-[#111827] mb-1">{tool.title}</h4>
                        <p className="text-xs text-[#6B7280] line-clamp-2">{tool.description}</p>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              지금 바로 데이터 기반 마케팅을 시작하세요
            </h2>
            <p className="text-[#6B7280] mb-8">
              무료 플랜으로 시작해 모든 분석 도구를 활용하세요. 신용카드가 필요 없습니다.
            </p>
            <Link
              href="/signup?role=brand"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-center cursor-pointer min-h-[48px]"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
