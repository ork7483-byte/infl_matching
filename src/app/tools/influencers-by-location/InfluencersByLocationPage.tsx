"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";

interface Influencer {
  username: string;
  displayName: string;
  category: string;
  location: string;
  followers: number;
  er: number;
  aqs: number;
  avatarColor: string;
  bio: string;
}

const LOCATIONS = ["서울", "부산", "대구", "인천", "대전", "광주", "경기", "기타"];
const CATEGORIES = ["전체", "뷰티", "패션", "푸드", "여행", "테크", "라이프스타일", "피트니스", "육아"];
const COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];

// Deterministic mock data with location tags
const MOCK_DATA: Influencer[] = (() => {
  const entries: Array<{ username: string; location: string; category: string; bio: string }> = [
    { username: "seoul_beauty", location: "서울", category: "뷰티", bio: "서울 기반 뷰티 크리에이터" },
    { username: "gangnam_chic", location: "서울", category: "패션", bio: "강남 스트릿 패션" },
    { username: "hongdae_eats", location: "서울", category: "푸드", bio: "홍대 맛집 탐방기" },
    { username: "itaewon_vibes", location: "서울", category: "라이프스타일", bio: "이태원 라이프" },
    { username: "bukchon_life", location: "서울", category: "여행", bio: "서울 로컬 여행" },
    { username: "seoul_fit", location: "서울", category: "피트니스", bio: "서울 헬스 루틴" },
    { username: "dongdaemun_mom", location: "서울", category: "육아", bio: "동대문 육아 일기" },
    { username: "mapo_tech", location: "서울", category: "테크", bio: "마포 스타트업 테크" },
    { username: "busan_wave", location: "부산", category: "여행", bio: "해운대 서퍼" },
    { username: "gwangalli_night", location: "부산", category: "라이프스타일", bio: "광안리 야경" },
    { username: "busan_food", location: "부산", category: "푸드", bio: "부산 돼지국밥 전도사" },
    { username: "busan_beauty", location: "부산", category: "뷰티", bio: "부산 뷰티 유튜버" },
    { username: "haeundae_fit", location: "부산", category: "피트니스", bio: "해운대 러너" },
    { username: "daegu_style", location: "대구", category: "패션", bio: "대구 패션 피플" },
    { username: "daegu_eats", location: "대구", category: "푸드", bio: "대구 찜갈비 맛집" },
    { username: "daegu_mom", location: "대구", category: "육아", bio: "대구 워킹맘 일기" },
    { username: "incheon_local", location: "인천", category: "여행", bio: "인천 로컬 여행" },
    { username: "songdo_tech", location: "인천", category: "테크", bio: "송도 테크 블로거" },
    { username: "incheon_food", location: "인천", category: "푸드", bio: "인천 차이나타운 맛집" },
    { username: "daejeon_dev", location: "대전", category: "테크", bio: "대전 개발자 일상" },
    { username: "daejeon_beauty", location: "대전", category: "뷰티", bio: "대전 뷰티 블로거" },
    { username: "gwangju_art", location: "광주", category: "라이프스타일", bio: "광주 아트씬" },
    { username: "gwangju_food", location: "광주", category: "푸드", bio: "광주 한식 탐방" },
    { username: "gyeonggi_mom", location: "경기", category: "육아", bio: "경기도 아이 셋 맘" },
    { username: "bundang_life", location: "경기", category: "라이프스타일", bio: "분당 라이프스타일" },
    { username: "suwon_eats", location: "경기", category: "푸드", bio: "수원 왕갈비 전문" },
    { username: "ilsan_beauty", location: "경기", category: "뷰티", bio: "일산 뷰티 크리에이터" },
    { username: "pangyo_dev", location: "경기", category: "테크", bio: "판교 스타트업 개발자" },
    { username: "jeju_nature", location: "기타", category: "여행", bio: "제주 자연 사랑" },
    { username: "jeju_food", location: "기타", category: "푸드", bio: "제주 흑돼지 탐방" },
    { username: "gyeongju_hist", location: "기타", category: "여행", bio: "경주 역사 여행" },
    { username: "gangwon_hike", location: "기타", category: "피트니스", bio: "강원도 등산 러버" },
    { username: "yeosu_sea", location: "기타", category: "라이프스타일", bio: "여수 바다 라이프" },
    { username: "busan_fashion", location: "부산", category: "패션", bio: "부산 빈티지 패션" },
    { username: "seoul_yoga", location: "서울", category: "피트니스", bio: "서울 요가 강사" },
    { username: "seoul_baby", location: "서울", category: "육아", bio: "서울 신혼부부 육아" },
    { username: "daejeon_fit", location: "대전", category: "피트니스", bio: "대전 크로스핏 코치" },
    { username: "incheon_style", location: "인천", category: "패션", bio: "인천 패션 크리에이터" },
    { username: "gwangju_fit", location: "광주", category: "피트니스", bio: "광주 헬스 트레이너" },
    { username: "gyeonggi_fashion", location: "경기", category: "패션", bio: "경기 패션 블로거" },
  ];

  return entries.map((e) => {
    const seed = e.username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return {
      ...e,
      displayName: e.username.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      followers: 3000 + ((seed * 11) % 497000),
      er: parseFloat((1.0 + (seed % 70) / 10).toFixed(2)),
      aqs: 48 + (seed % 47),
      avatarColor: COLORS[seed % COLORS.length],
    };
  });
})();

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function InfluencersByLocationPage() {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [selectedLocation, setSelectedLocation] = useState("서울");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const visibleLimit = isAuth ? Infinity : 10;

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((inf) => {
      const matchLoc = inf.location === selectedLocation;
      const matchCat = selectedCategory === "전체" || inf.category === selectedCategory;
      return matchLoc && matchCat;
    });
  }, [selectedLocation, selectedCategory]);

  const visibleItems = filtered.slice(0, visibleLimit === Infinity ? filtered.length : visibleLimit);
  const blurredItems = !isAuth ? filtered.slice(visibleLimit as number, (visibleLimit as number) + 5) : [];

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
            📍 무료 지역 검색 도구
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            지역별 인플루언서 찾기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            서울, 부산, 대구 등 지역별 인플루언서를 바로 찾아보세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            {isAuth ? "전체 인플루언서 목록을 확인하세요." : "10명 무료 공개 — 전체 보기는 무료 회원가입 후 가능"}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">지역</p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedLocation === loc
                      ? "bg-[#7c3aed] text-white"
                      : "bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] hover:border-[#7c3aed]/40"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">카테고리 (선택)</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#7c3aed]/10 text-[#7c3aed] font-semibold border border-[#7c3aed]/30"
                      : "text-[#6B7280] border border-[#E5E7EB] hover:border-[#7c3aed]/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[#374151]">
              {selectedLocation} · {selectedCategory}{" "}
              <span className="text-[#9CA3AF] font-normal ml-1">
                ({isAuth ? filtered.length : Math.min(filtered.length, 10)}명
                {!isAuth && filtered.length > 10 && " 공개"})
              </span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center text-[#9CA3AF]">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-base">해당 지역·카테고리에 인플루언서가 없어요.</p>
              <p className="text-sm mt-1">다른 조건으로 검색해보세요.</p>
            </div>
          ) : (
            <>
              {/* Visible grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleItems.map((inf) => (
                  <div
                    key={inf.username}
                    className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#7c3aed]/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: inf.avatarColor }}
                      >
                        {inf.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#111827] truncate">{inf.displayName}</div>
                        <div className="text-xs text-[#9CA3AF]">@{inf.username}</div>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#7c3aed]/10 text-[#7c3aed] font-medium">
                            {inf.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]">
                            📍 {inf.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#6B7280] mb-4 line-clamp-2">{inf.bio}</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#F9FAFB] rounded-xl py-2">
                        <div className="text-sm font-bold text-[#111827]">{formatFollowers(inf.followers)}</div>
                        <div className="text-xs text-[#9CA3AF]">팔로워</div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-xl py-2">
                        <div className="text-sm font-bold text-[#7c3aed]">{inf.er}%</div>
                        <div className="text-xs text-[#9CA3AF]">참여율</div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-xl py-2">
                        <div className="text-sm font-bold text-[#111827]">{inf.aqs}</div>
                        <div className="text-xs text-[#9CA3AF]">AQS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blurred overflow for non-auth */}
              {blurredItems.length > 0 && (
                <div className="mt-4">
                  <BlurOverlay
                    ctaText="무료 가입으로 전체 보기"
                    ctaLink="/signup"
                    blurIntensity={6}
                    className="rounded-2xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {blurredItems.map((inf) => (
                        <div
                          key={inf.username}
                          className="bg-white rounded-2xl border border-[#E5E7EB] p-5"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                              style={{ backgroundColor: inf.avatarColor }}
                            >
                              {inf.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-[#111827]">{inf.displayName}</div>
                              <div className="text-xs text-[#9CA3AF]">@{inf.username}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-[#F9FAFB] rounded-xl py-2">
                              <div className="text-sm font-bold">{formatFollowers(inf.followers)}</div>
                              <div className="text-xs text-[#9CA3AF]">팔로워</div>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-xl py-2">
                              <div className="text-sm font-bold text-[#7c3aed]">{inf.er}%</div>
                              <div className="text-xs text-[#9CA3AF]">참여율</div>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-xl py-2">
                              <div className="text-sm font-bold">{inf.aqs}</div>
                              <div className="text-xs text-[#9CA3AF]">AQS</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BlurOverlay>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">지역별 인플루언서 검색이란?</h2>
          <div className="text-[#6B7280] leading-relaxed space-y-4 mb-10">
            <p>
              지역별 인플루언서 검색은 특정 지역을 기반으로 활동하는 인플루언서를 찾는 기능입니다.
              오프라인 이벤트, 로컬 매장 오픈, 지역 특화 브랜드 캠페인 등에서 지역 인플루언서를 활용하면 타겟 오디언스와의 연결이 훨씬 효과적입니다.
            </p>
            <p>
              서울·경기 수도권뿐 아니라 부산, 대구, 인천, 대전, 광주 등 전국 주요 도시의 인플루언서를 카테고리별로 필터링할 수 있습니다.
              뷰티, 패션, 푸드, 여행, 테크 등 카테고리와 지역을 조합하면 원하는 타겟에 딱 맞는 파트너를 빠르게 찾을 수 있습니다.
            </p>
            <p>
              비로그인 상태에서는 10명까지 무료로 확인할 수 있으며, 무료 회원가입 후에는 전체 인플루언서 목록과 상세 프로필을 이용할 수 있습니다.
              로컬 마케팅 캠페인의 효율을 극대화하려면 지역 기반 인플루언서 섭외를 적극 활용해보세요.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "지역 정보는 어떻게 수집되나요?",
                a: "인플루언서가 Inflix에 등록할 때 입력한 활동 지역 정보를 기반으로 합니다. 인스타그램 프로필의 위치 정보도 참고합니다. 실제 거주지와 다를 수 있으므로 주요 활동 지역으로 이해해주세요.",
              },
              {
                q: "특정 도시 내 구(區) 단위로도 검색할 수 있나요?",
                a: "현재는 주요 도시 단위로 검색할 수 있습니다. 향후 업데이트에서 구·동 단위의 세부 지역 검색 기능을 추가할 예정입니다.",
              },
              {
                q: "지역별 인플루언서를 활용하면 어떤 장점이 있나요?",
                a: "로컬 오디언스와의 신뢰도 높은 연결, 오프라인 이벤트와의 시너지, 지역 커뮤니티 내 바이럴 효과 등을 기대할 수 있습니다. 특히 외식·리테일·관광 업종에서 효과가 크게 나타납니다.",
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/tools/compare", icon: "🔍", title: "인플루언서 비교", desc: "2~5명을 나란히 비교하세요." },
              { href: "/tools/top-influencers", icon: "🏆", title: "카테고리별 TOP 100", desc: "인기 인플루언서 순위 확인." },
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "ER을 즉시 계산하세요." },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-start gap-3 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-2xl">{t.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors text-sm">
                    {t.title}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-3">지역 인플루언서 전체 목록이 필요하세요?</h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입하면 전국 모든 지역의 인플루언서 목록과 상세 프로필을 무료로 이용할 수 있어요.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] transition-colors text-base"
          >
            무료 가입하기 →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
