"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const allModels = [
  { id: "sua", name: "수아", gender: "여성", age: "20대", style: "캐주얼", portfolio: 48, img: 64 },
  { id: "haeun", name: "하은", gender: "여성", age: "20대", style: "스포티", portfolio: 36, img: 65 },
  { id: "jiu", name: "지유", gender: "여성", age: "30대", style: "럭셔리", portfolio: 52, img: 66 },
  { id: "seoyeon", name: "서연", gender: "여성", age: "20대", style: "내추럴", portfolio: 41, img: 67 },
  { id: "mina", name: "미나", gender: "여성", age: "20대", style: "스트릿", portfolio: 29, img: 68 },
  { id: "yejin", name: "예진", gender: "여성", age: "30대", style: "포멀", portfolio: 44, img: 69 },
  { id: "jiho", name: "지호", gender: "남성", age: "30대", style: "비즈니스", portfolio: 38, img: 91 },
  { id: "minjun", name: "민준", gender: "남성", age: "20대", style: "스트릿", portfolio: 33, img: 92 },
  { id: "hyunwoo", name: "현우", gender: "남성", age: "20대", style: "스포티", portfolio: 27, img: 93 },
  { id: "taeyun", name: "태윤", gender: "남성", age: "30대", style: "럭셔리", portfolio: 45, img: 94 },
  { id: "junseo", name: "준서", gender: "남성", age: "20대", style: "내추럴", portfolio: 31, img: 95 },
  { id: "doyun", name: "도윤", gender: "남성", age: "30대", style: "아웃도어", portfolio: 39, img: 96 },
];

const genderOptions = ["전체", "여성", "남성"];
const ageOptions = ["전체", "20대", "30대"];
const styleOptions = ["전체", "캐주얼", "스포티", "럭셔리", "내추럴", "스트릿", "포멀", "비즈니스", "아웃도어"];

export default function ModelsPage() {
  const [gender, setGender] = useState("전체");
  const [age, setAge] = useState("전체");
  const [style, setStyle] = useState("전체");

  const filtered = allModels.filter(
    (m) =>
      (gender === "전체" || m.gender === gender) &&
      (age === "전체" || m.age === age) &&
      (style === "전체" || m.style === style)
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="pt-32 pb-10 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/10 text-[#7c3aed] text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/20">
              🤖 AI 모델 갤러리
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-4">
              브랜드 분위기에 맞는{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                AI 모델
              </span>
              을 선택하세요
            </h1>
            <p className="text-[#6B7280] text-lg">
              {allModels.length}명의 AI 모델이 당신의 브랜드를 표현할 준비가 되어 있습니다.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 px-4 border-b border-[#E5E7EB] bg-[#F9FAFB] sticky top-16 z-10">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-[#374151] font-medium text-sm whitespace-nowrap">성별</span>
              <div className="flex gap-1">
                {genderOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGender(opt)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      gender === opt
                        ? "bg-[#7c3aed] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#7c3aed]/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#374151] font-medium text-sm whitespace-nowrap">연령대</span>
              <div className="flex gap-1">
                {ageOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAge(opt)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      age === opt
                        ? "bg-[#7c3aed] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#7c3aed]/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#374151] font-medium text-sm whitespace-nowrap">스타일</span>
              <div className="flex gap-1 flex-wrap">
                {styleOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStyle(opt)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      style === opt
                        ? "bg-[#7c3aed] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#7c3aed]/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#6B7280]">
                <div className="text-5xl mb-4">🤖</div>
                <p className="text-lg">해당 조건의 모델이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((model) => (
                  <div
                    key={model.id}
                    className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#7c3aed]/50 hover:shadow-lg transition-all group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={`https://picsum.photos/seed/${model.img}/300/400`}
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-[#7c3aed] text-white text-xs font-semibold px-2 py-1 rounded-full">
                        🤖 AI
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[#111827] font-semibold text-base mb-1">{model.name}</h3>
                      <p className="text-[#6B7280] text-sm mb-2">
                        {model.age} · {model.gender}
                      </p>
                      <div className="flex gap-1 flex-wrap mb-3">
                        <span className="bg-[#7c3aed]/10 text-[#7c3aed] text-xs px-2 py-1 rounded-full">
                          {model.style}
                        </span>
                      </div>
                      <p className="text-[#9CA3AF] text-xs mb-3">포트폴리오 {model.portfolio}개</p>
                      <Link
                        href={`/ai-studio/generate?model=${model.id}`}
                        className="block w-full text-center bg-[#7c3aed] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#6d28d9] transition-colors"
                      >
                        제작하기
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="py-16 px-4 bg-[#F9FAFB]">
          <div className="max-w-3xl mx-auto text-center bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-[#111827] mb-3">
              브랜드 전용 커스텀 AI 모델이 필요하신가요?
            </h2>
            <p className="text-[#6B7280] mb-6">
              브랜드 아이덴티티에 맞는 전용 AI 모델을 제작해 드립니다. 독점 사용권 포함.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#7c3aed] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#6d28d9] transition-colors"
            >
              Enterprise 문의하기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
