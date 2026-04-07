"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const models = [
  { id: "sua", name: "수아", style: "캐주얼", img: 64 },
  { id: "haeun", name: "하은", style: "스포티", img: 65 },
  { id: "jiu", name: "지유", style: "럭셔리", img: 66 },
  { id: "seoyeon", name: "서연", style: "내추럴", img: 67 },
  { id: "mina", name: "미나", style: "스트릿", img: 68 },
  { id: "yejin", name: "예진", style: "포멀", img: 69 },
  { id: "jiho", name: "지호", style: "비즈니스", img: 91 },
  { id: "minjun", name: "민준", style: "스트릿", img: 92 },
];

const contentTypes = [
  { id: "product", label: "제품 촬영", icon: "📦" },
  { id: "lifestyle", label: "라이프스타일", icon: "🌿" },
  { id: "fashion", label: "패션 화보", icon: "👗" },
  { id: "beauty", label: "뷰티", icon: "💄" },
  { id: "sns", label: "SNS 피드", icon: "📱" },
  { id: "story", label: "스토리", icon: "🎬" },
];

const backgrounds = ["흰 배경", "자연", "카페", "스튜디오", "야외", "인테리어"];
const moods = ["밝고 화사한", "따뜻한 감성", "쿨톤 모던", "럭셔리 시크", "미니멀", "활기찬"];
const compositions = ["정면", "측면", "위에서", "클로즈업", "전신", "반신"];
const ratios = ["1:1", "4:5", "9:16", "16:9", "3:4"];

const resultSeeds = [201, 202, 203, 204];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GeneratePageInner() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get("model") ?? "sua";

  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [contentType, setContentType] = useState("");
  const [background, setBackground] = useState("");
  const [mood, setMood] = useState("");
  const [composition, setComposition] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [prompt, setPrompt] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const credits = 7;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };

  const stepLabels = ["모델 선택", "콘텐츠 유형", "제품 이미지", "스타일 설정", "추가 설명"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
          {/* Credits */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#111827]">✨ 콘텐츠 생성</h1>
            <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-2 shadow-sm">
              <span className="text-[#7c3aed]">⚡</span>
              <span className="text-[#374151] font-semibold">{credits}</span>
              <span className="text-[#6B7280] text-sm">크레딧 잔여</span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              return (
                <div key={n} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`flex items-center gap-2 cursor-pointer`}
                    onClick={() => n < step && setStep(n)}
                  >
                    <div
                      className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0 ${
                        n === step
                          ? "bg-[#7c3aed] text-white"
                          : n < step
                          ? "bg-[#7c3aed]/20 text-[#7c3aed]"
                          : "bg-[#E5E7EB] text-[#9CA3AF]"
                      }`}
                    >
                      {n < step ? "✓" : n}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        n === step ? "text-[#7c3aed]" : n < step ? "text-[#7c3aed]/70" : "text-[#9CA3AF]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-6 h-px flex-shrink-0 ${n < step ? "bg-[#7c3aed]/40" : "bg-[#E5E7EB]"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Step 1: Model */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-6">AI 모델을 선택하세요</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedModel === m.id ? "border-[#7c3aed] shadow-md" : "border-[#E5E7EB]"
                      }`}
                    >
                      <img
                        src={`https://picsum.photos/seed/${m.img}/120/160`}
                        alt={m.name}
                        className="w-24 h-32 object-cover"
                      />
                      <div className="px-2 py-2 text-center">
                        <p className={`text-sm font-semibold ${selectedModel === m.id ? "text-[#7c3aed]" : "text-[#374151]"}`}>
                          {m.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{m.style}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Content Type */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-6">콘텐츠 유형을 선택하세요</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {contentTypes.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setContentType(ct.id)}
                      className={`rounded-xl border-2 p-5 text-center transition-all ${
                        contentType === ct.id
                          ? "border-[#7c3aed] bg-[#7c3aed]/5"
                          : "border-[#E5E7EB] hover:border-[#7c3aed]/40"
                      }`}
                    >
                      <div className="text-3xl mb-2">{ct.icon}</div>
                      <div className={`text-sm font-medium ${contentType === ct.id ? "text-[#7c3aed]" : "text-[#374151]"}`}>
                        {ct.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Product Image */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-2">제품 이미지 업로드</h2>
                <p className="text-[#6B7280] text-sm mb-6">선택사항 — 제품 이미지를 올리면 AI가 해당 제품을 모델에 적용합니다.</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                    dragOver ? "border-[#7c3aed] bg-[#7c3aed]/5" : "border-[#D1D5DB] hover:border-[#7c3aed]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setUploadedFile(f.name);
                    }}
                  />
                  {uploadedFile ? (
                    <>
                      <div className="text-4xl mb-3">✅</div>
                      <p className="text-[#7c3aed] font-semibold">{uploadedFile}</p>
                      <p className="text-[#9CA3AF] text-sm mt-1">클릭하여 변경</p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-3">📁</div>
                      <p className="text-[#374151] font-medium">드래그 앤 드롭 또는 클릭하여 업로드</p>
                      <p className="text-[#9CA3AF] text-sm mt-1">JPG, PNG, WEBP (최대 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Style */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-6">스타일을 설정하세요</h2>
                <div className="space-y-6">
                  {[
                    { label: "배경", options: backgrounds, value: background, set: setBackground },
                    { label: "분위기", options: moods, value: mood, set: setMood },
                    { label: "구도", options: compositions, value: composition, set: setComposition },
                    { label: "비율", options: ratios, value: ratio, set: setRatio },
                  ].map(({ label, options, value, set }) => (
                    <div key={label}>
                      <p className="text-sm font-semibold text-[#374151] mb-2">{label}</p>
                      <div className="flex flex-wrap gap-2">
                        {options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => set(opt)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              value === opt
                                ? "bg-[#7c3aed] text-white"
                                : "bg-[#F3F4F6] text-[#374151] hover:bg-[#7c3aed]/10"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Prompt */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-2">추가 설명을 입력하세요</h2>
                <p className="text-[#6B7280] text-sm mb-4">원하는 스타일, 분위기, 세부 사항을 자유롭게 적어주세요.</p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="예: 봄 신상 원피스를 입고 따뜻한 햇살 아래 카페 테라스에서 커피를 들고 있는 자연스러운 모습..."
                  rows={5}
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#374151] placeholder-[#9CA3AF] resize-none focus:outline-none focus:border-[#7c3aed] transition-colors text-base"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  step === 1
                    ? "text-[#D1D5DB] cursor-not-allowed"
                    : "text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                }`}
                disabled={step === 1}
              >
                ← 이전
              </button>
              {step < 5 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-[#7c3aed] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#6d28d9] transition-colors text-sm"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-[#7c3aed] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#6d28d9] transition-colors text-sm disabled:opacity-60"
                >
                  {loading ? "⏳ 생성 중..." : "✨ 생성하기"}
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center shadow-sm">
              <div className="text-5xl mb-4 animate-bounce">✨</div>
              <p className="text-[#7c3aed] font-semibold text-lg">AI가 이미지를 생성하고 있습니다...</p>
              <p className="text-[#9CA3AF] text-sm mt-2">최대 30초 소요됩니다</p>
              <div className="mt-6 w-full bg-[#F3F4F6] rounded-full h-2">
                <div className="bg-[#7c3aed] h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {/* Results */}
          {generated && !loading && (
            <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#111827]">🎉 생성 완료!</h2>
                <span className="text-[#9CA3AF] text-sm">4장 생성됨</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {resultSeeds.map((seed, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#F3F4F6] relative group">
                    <img
                      src={`https://picsum.photos/seed/${seed}/400/400`}
                      alt={`생성 결과 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 bg-white text-[#374151] font-semibold text-sm px-4 py-2 rounded-lg transition-all">
                        다운로드
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setGenerated(false); setStep(1); }}
                  className="flex-1 border border-[#7c3aed] text-[#7c3aed] font-semibold py-3 rounded-xl hover:bg-[#7c3aed]/5 transition-colors"
                >
                  🔄 재생성하기
                </button>
                <button className="flex-1 bg-[#7c3aed] text-white font-semibold py-3 rounded-xl hover:bg-[#6d28d9] transition-colors">
                  ⬇ 전체 다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-[#7c3aed]">로딩 중...</span></div>}>
      <GeneratePageInner />
    </Suspense>
  );
}
