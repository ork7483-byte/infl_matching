"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const modelsData: Record<
  string,
  {
    name: string;
    age: string;
    gender: string;
    style: string;
    img: number;
    capabilities: string[];
  }
> = {
  sua: { name: "수아", age: "20대", gender: "여성", style: "캐주얼", img: 64, capabilities: ["제품 촬영", "SNS 피드", "라이프스타일", "일상 룩북"] },
  haeun: { name: "하은", age: "20대", gender: "여성", style: "스포티", img: 65, capabilities: ["스포츠웨어", "액티브 라이프", "야외 촬영", "SNS 피드"] },
  jiu: { name: "지유", age: "30대", gender: "여성", style: "럭셔리", img: 66, capabilities: ["럭셔리 제품", "하이엔드 화보", "패션 화보", "뷰티"] },
  seoyeon: { name: "서연", age: "20대", gender: "여성", style: "내추럴", img: 67, capabilities: ["자연광 촬영", "내추럴 뷰티", "라이프스타일", "SNS 피드"] },
  mina: { name: "미나", age: "20대", gender: "여성", style: "스트릿", img: 68, capabilities: ["스트릿 패션", "캐주얼 룩", "SNS 릴스", "A/B 테스트"] },
  yejin: { name: "예진", age: "30대", gender: "여성", style: "포멀", img: 69, capabilities: ["비즈니스 의류", "포멀 화보", "브랜드 광고", "쇼핑몰"] },
  jiho: { name: "지호", age: "30대", gender: "남성", style: "비즈니스", img: 91, capabilities: ["비즈니스 의류", "테크 제품", "포멀 화보", "광고 시안"] },
  minjun: { name: "민준", age: "20대", gender: "남성", style: "스트릿", img: 92, capabilities: ["스트릿 패션", "스니커즈", "SNS 피드", "A/B 테스트"] },
  hyunwoo: { name: "현우", age: "20대", gender: "남성", style: "스포티", img: 93, capabilities: ["스포츠웨어", "피트니스", "아웃도어", "액티브 라이프"] },
  taeyun: { name: "태윤", age: "30대", gender: "남성", style: "럭셔리", img: 94, capabilities: ["럭셔리 제품", "하이엔드 화보", "패션 광고", "쇼핑몰"] },
  junseo: { name: "준서", age: "20대", gender: "남성", style: "내추럴", img: 95, capabilities: ["자연광 촬영", "캐주얼 룩", "라이프스타일", "SNS 피드"] },
  doyun: { name: "도윤", age: "30대", gender: "남성", style: "아웃도어", img: 96, capabilities: ["아웃도어 의류", "캠핑/등산", "스포츠 제품", "라이프스타일"] },
};

const categories = ["전체", "제품", "라이프", "패션", "뷰티"];

const presets = [
  { label: "밝고 화사한", emoji: "☀️" },
  { label: "따뜻한 감성", emoji: "🌅" },
  { label: "쿨톤 모던", emoji: "❄️" },
  { label: "럭셔리 시크", emoji: "✨" },
];

export default function ModelDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeCategory, setActiveCategory] = useState("전체");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const model = modelsData[id] ?? modelsData["sua"];

  const portfolioSeeds = Array.from({ length: 12 }, (_, i) => model.img + i * 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Profile Header */}
        <section className="pt-24 pb-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <img
                  src={`https://picsum.photos/seed/${model.img}/200/200`}
                  alt={model.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#7c3aed] text-white text-xs font-semibold px-2 py-1 rounded-full">
                  🤖 AI
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-2">
                  {model.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#F3F4F6] text-[#374151] text-sm px-3 py-1 rounded-full">
                    {model.age}
                  </span>
                  <span className="bg-[#F3F4F6] text-[#374151] text-sm px-3 py-1 rounded-full">
                    {model.gender}
                  </span>
                  <span className="bg-[#7c3aed]/10 text-[#7c3aed] text-sm px-3 py-1 rounded-full font-medium">
                    {model.style}
                  </span>
                </div>
                <Link
                  href={`/ai-studio/generate?model=${id}`}
                  className="inline-block bg-[#7c3aed] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#6d28d9] transition-colors"
                >
                  ✨ 이 모델로 제작하기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="px-4 border-b border-[#E5E7EB]">
          <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === cat
                    ? "border-[#7c3aed] text-[#7c3aed]"
                    : "border-transparent text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {portfolioSeeds.map((seed, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-[#F3F4F6] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <img
                    src={`https://picsum.photos/seed/${seed}/300/300`}
                    alt={`포트폴리오 ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-10 px-4 bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-[#111827] mb-5">제작 가능한 콘텐츠</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {model.capabilities.map((cap) => (
                <div
                  key={cap}
                  className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#374151] text-sm font-medium text-center"
                >
                  {cap}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Style Presets */}
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-[#111827] mb-5">스타일 프리셋</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSelectedPreset(preset.label)}
                  className={`rounded-2xl p-5 border-2 text-center transition-all ${
                    selectedPreset === preset.label
                      ? "border-[#7c3aed] bg-[#7c3aed]/5"
                      : "border-[#E5E7EB] bg-white hover:border-[#7c3aed]/40"
                  }`}
                >
                  <div className="text-3xl mb-2">{preset.emoji}</div>
                  <div className={`text-sm font-medium ${selectedPreset === preset.label ? "text-[#7c3aed]" : "text-[#374151]"}`}>
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#7c3aed] to-[#a855f7]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {model.name} 모델로 콘텐츠를 만들어보세요
            </h2>
            <p className="text-white/80 mb-8">3분 안에 전문 화보 수준의 이미지를 생성합니다.</p>
            <Link
              href={`/ai-studio/generate?model=${id}`}
              className="inline-block bg-white text-[#7c3aed] font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-colors"
            >
              ✨ 이 모델로 제작하기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
