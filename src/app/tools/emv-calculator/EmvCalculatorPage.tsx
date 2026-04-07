"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BarChartComponent from "@/components/charts/BarChartComponent";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_CPM: Record<string, number> = {
  뷰티: 8000,
  패션: 7000,
  푸드: 6500,
  여행: 6000,
  피트니스: 7500,
  라이프스타일: 6000,
  테크: 7000,
  게임: 5500,
  교육: 5000,
  기타: 5500,
};

const CATEGORIES = Object.keys(CATEGORY_CPM);
const CPE = 500; // ₩ per engagement
const REACH_RATE = 0.3;
const NAVER_CPM = 12000;

const CHANNEL_CPM_DATA = [
  { name: "네이버", value: 12000 },
  { name: "구글", value: 8000 },
  { name: "페이스북", value: 5000 },
  { name: "인스타그램", value: 4000 },
  { name: "인플루언서", value: 3000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtKRW(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억 원`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만원`;
  return `${Math.round(n).toLocaleString()}원`;
}

function fmtNum(n: number) {
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return n.toLocaleString();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmvCalculatorPage() {
  const { data: session } = useSession();
  const isAuthed = !!session;

  const [tab, setTab] = useState<"username" | "manual">("manual");

  // Mode A
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameResult, setUsernameResult] = useState<{
    followers: number;
    avgLikes: number;
    avgComments: number;
  } | null>(null);

  // Mode B
  const [followers, setFollowers] = useState("100000");
  const [avgLikes, setAvgLikes] = useState("3000");
  const [avgComments, setAvgComments] = useState("150");
  const [category, setCategory] = useState("뷰티");

  // Simulate username lookup (mock in dev)
  function handleUsernameLookup() {
    if (!username.trim()) return;
    setUsernameLoading(true);
    setUsernameResult(null);
    setTimeout(() => {
      // Mock result
      setUsernameResult({ followers: 82000, avgLikes: 2460, avgComments: 122 });
      setUsernameLoading(false);
    }, 1200);
  }

  const activeFollowers =
    tab === "username" && usernameResult
      ? usernameResult.followers
      : Number(followers) || 0;
  const activeLikes =
    tab === "username" && usernameResult
      ? usernameResult.avgLikes
      : Number(avgLikes) || 0;
  const activeComments =
    tab === "username" && usernameResult
      ? usernameResult.avgComments
      : Number(avgComments) || 0;

  const result = useMemo(() => {
    const f = Math.max(0, activeFollowers);
    const l = Math.max(0, activeLikes);
    const c = Math.max(0, activeComments);
    const cpm = CATEGORY_CPM[category] ?? 5500;

    const reach = Math.round(f * REACH_RATE);
    const engagements = l + c;
    const emv = (reach * cpm) / 1000 + engagements * CPE;
    const naverEquiv = (reach * NAVER_CPM) / 1000;

    return { reach, engagements, emv, naverEquiv, cpm };
  }, [activeFollowers, activeLikes, activeComments, category]);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* Hero */}
      <section className="py-16 px-4 text-center bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ backgroundColor: "#7c3aed15", color: "#7c3aed", border: "1px solid #7c3aed30" }}
          >
            💎 무료 EMV 계산기
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인플루언서 미디어 가치<br className="hidden sm:block" /> (EMV) 계산기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            게시물 1건의 미디어 가치를 네이버 검색광고와 비교해서 확인하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">완전 무료 — 로그인 없이 사용하세요.</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-1 w-fit">
            {(["manual", "username"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-white text-[#7c3aed] shadow-sm border border-[#E5E7EB]"
                    : "text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                {t === "manual" ? "수치 직접 입력" : "사용자명 입력"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-5">
              <h2 className="text-base font-semibold text-[#111827]">
                {tab === "username" ? "인스타그램 계정" : "인플루언서 수치"}
              </h2>

              {tab === "username" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      인스타그램 사용자명
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                        <span className="text-[#9CA3AF] mr-1.5 text-sm">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleUsernameLookup()}
                          className="flex-1 outline-none text-base bg-transparent"
                          placeholder="username"
                        />
                      </div>
                      <button
                        onClick={handleUsernameLookup}
                        disabled={usernameLoading || !username.trim()}
                        className="px-4 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors whitespace-nowrap"
                      >
                        {usernameLoading ? "조회중..." : "조회"}
                      </button>
                    </div>
                  </div>
                  {usernameResult && (
                    <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">팔로워</span>
                        <span className="font-semibold">{fmtNum(usernameResult.followers)}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">평균 좋아요</span>
                        <span className="font-semibold">{fmtNum(usernameResult.avgLikes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">평균 댓글</span>
                        <span className="font-semibold">{fmtNum(usernameResult.avgComments)}</span>
                      </div>
                    </div>
                  )}
                  {!usernameResult && !usernameLoading && (
                    <p className="text-xs text-[#9CA3AF]">사용자명을 입력하고 조회를 눌러주세요.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "팔로워 수", value: followers, setter: setFollowers, placeholder: "100000", suffix: "명" },
                    { label: "평균 좋아요", value: avgLikes, setter: setAvgLikes, placeholder: "3000", suffix: "" },
                    { label: "평균 댓글", value: avgComments, setter: setAvgComments, placeholder: "150", suffix: "" },
                  ].map(({ label, value, setter, placeholder, suffix }) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
                      <div className="flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                        <input
                          type="number"
                          min={0}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className="flex-1 outline-none text-base bg-transparent"
                          placeholder={placeholder}
                        />
                        {suffix && <span className="text-[#9CA3AF] ml-2 text-sm">{suffix}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category selector shared across both modes */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">카테고리</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-base outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (CPM ₩{CATEGORY_CPM[cat].toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* EMV Highlight */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "linear-gradient(135deg, #7c3aed15, #e9456015)", border: "1px solid #7c3aed20" }}
              >
                <div className="text-xs font-medium text-[#7c3aed] mb-1">게시물 1건 미디어 가치</div>
                <div className="text-5xl font-black text-[#7c3aed] mb-1">
                  {result.emv > 0 ? fmtKRW(result.emv) : "-"}
                </div>
                <div className="text-xs text-[#6B7280]">EMV (Earned Media Value)</div>
              </div>

              {/* Naver comparison */}
              {result.emv > 0 && (
                <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-5">
                  <div className="text-xs text-[#6B7280] mb-1">네이버 검색광고 환산 효과</div>
                  <div className="text-2xl font-bold text-[#111827]">{fmtKRW(result.naverEquiv)}</div>
                  <div className="text-xs text-[#9CA3AF] mt-1">
                    동일 도달 {fmtNum(result.reach)}명 기준 · CPM ₩{NAVER_CPM.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "예상 도달", value: fmtNum(result.reach), sub: "Reach" },
                    { label: "총 참여", value: fmtNum(result.engagements), sub: "Engagements" },
                    { label: "카테고리 CPM", value: `₩${result.cpm.toLocaleString()}`, sub: "1,000 노출당" },
                    { label: "CPE", value: `₩${CPE.toLocaleString()}`, sub: "참여당 가치" },
                  ].map((m) => (
                    <div key={m.label} className="p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-lg font-bold text-[#7c3aed]">{m.value}</div>
                      <div className="text-xs font-medium text-[#374151] mt-0.5">{m.label}</div>
                      <div className="text-xs text-[#9CA3AF]">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Channel CPM Chart — auth gated */}
          {result.emv > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#374151] mb-1">채널별 CPM 비교</h3>
              <p className="text-xs text-[#9CA3AF] mb-4">인플루언서 마케팅 vs 주요 디지털 광고 채널</p>
              {isAuthed ? (
                <BarChartComponent data={CHANNEL_CPM_DATA} />
              ) : (
                <div className="relative">
                  <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }}>
                    <BarChartComponent data={CHANNEL_CPM_DATA} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 border border-[#E5E7EB] rounded-2xl px-6 py-5 text-center shadow-lg max-w-xs">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm font-semibold text-[#111827] mb-1">채널 비교 차트</p>
                      <p className="text-xs text-[#6B7280] mb-3">로그인하면 무료로 확인할 수 있어요</p>
                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors"
                      >
                        무료 가입하기
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formula breakdown */}
          {result.emv > 0 && (
            <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-semibold text-[#374151] mb-4">계산 공식</h3>
              <div className="space-y-2 text-xs text-[#6B7280]">
                <div className="flex gap-2">
                  <span className="font-medium text-[#374151] min-w-[72px]">도달(Reach):</span>
                  <span>팔로워 {fmtNum(activeFollowers)} × 30% = {fmtNum(result.reach)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-[#374151] min-w-[72px]">노출 가치:</span>
                  <span>도달 {fmtNum(result.reach)} × CPM ₩{result.cpm.toLocaleString()} / 1,000 = {fmtKRW((result.reach * result.cpm) / 1000)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-[#374151] min-w-[72px]">참여 가치:</span>
                  <span>참여 {fmtNum(result.engagements)} × CPE ₩{CPE.toLocaleString()} = {fmtKRW(result.engagements * CPE)}</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#E5E7EB] font-medium text-[#374151]">
                  <span className="min-w-[72px]">EMV:</span>
                  <span>노출 가치 + 참여 가치 = {fmtKRW(result.emv)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-[#9CA3AF]">
                * CPM은 카테고리별 업계 평균값이며, 실제 미디어 가치는 콘텐츠 품질·시기·타겟 일치도에 따라 달라질 수 있습니다.
              </p>
            </div>
          )}

          {/* CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #7c3aed15, #e9456015)" }}
          >
            <h3 className="text-lg font-bold text-[#111827] mb-2">EMV 리포트를 PDF로 다운로드</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              무료 회원가입 후 계산 결과를 PDF 리포트로 저장하고 팀과 공유하세요.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] transition-colors text-sm"
            >
              무료 가입하고 리포트 받기 →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">EMV(미디어 가치)란?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            EMV(Earned Media Value)는 인플루언서 게시물이 생성하는 미디어 노출의 금전적 가치입니다.
            동일한 노출·참여를 유료 광고로 달성하려면 얼마가 필요한지 역산하여 산출합니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            본 계산기는 카테고리별 업계 평균 CPM과 참여당 가치(CPE ₩500)를 기반으로 계산합니다.
            뷰티·피트니스 카테고리는 높은 CPM이 적용되어 같은 팔로워 수라도 더 높은 EMV를 보입니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "EMV와 ROI의 차이는 무엇인가요?",
                a: "EMV는 미디어 노출의 추정 금전 가치이고, ROI는 실제 투자 대비 비즈니스 성과(매출·전환)를 나타냅니다. EMV는 브랜드 인지도 캠페인 평가에, ROI는 성과형 캠페인 평가에 적합합니다.",
              },
              {
                q: "CPM은 왜 카테고리마다 다른가요?",
                a: "카테고리별 광고주 경쟁 강도, 타겟 오디언스 구매력, 콘텐츠 몰입도가 다르기 때문입니다. 뷰티·패션 카테고리는 광고주 수요가 높아 CPM이 높게 형성됩니다.",
              },
              {
                q: "도달률 30%는 어떤 근거인가요?",
                a: "인스타그램 알고리즘 특성상 팔로워의 약 20~40%에게 피드 게시물이 노출됩니다. 본 계산기는 보수적 기준으로 30%를 적용합니다. 릴스(Reels)는 더 높은 도달률을 보일 수 있습니다.",
              },
              {
                q: "마이크로 인플루언서와 메가 인플루언서 중 EMV가 더 높은 쪽은?",
                a: "팔로워 절대 수는 메가 인플루언서가 높지만, 단가 대비 EMV(EMV/비용)는 마이크로 인플루언서가 유리한 경우가 많습니다. 참여율이 높고 타겟이 명확하기 때문입니다.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-[#E5E7EB] p-5 bg-white">
                <h3 className="font-semibold text-[#111827] mb-2">Q. {faq.q}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 px-4 border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-[#111827] mb-6 text-center">관련 무료 도구</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/tools/roi-calculator", icon: "💹", title: "ROI 계산기", desc: "인플루언서 마케팅 예상 ROI를 계산하세요." },
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "ER을 즉시 계산하고 등급을 확인하세요." },
              { href: "/tools/hashtag-analyzer", icon: "#️⃣", title: "해시태그 분석기", desc: "경쟁 난이도와 관련 태그를 분석하세요." },
              { href: "/tools/competitor-analysis", icon: "🔍", title: "경쟁사 분석", desc: "경쟁사 인플루언서 마케팅 전략을 확인하세요." },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-3xl">{tool.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">{tool.title}</div>
                  <div className="text-sm text-[#6B7280] mt-1">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
