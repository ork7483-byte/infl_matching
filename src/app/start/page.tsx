"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LandingMinimalHeader from "@/components/landing/LandingMinimalHeader";
import LandingStickyCTA from "@/components/landing/LandingStickyCTA";

export default function StartPage() {
  const heroCTARef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingMinimalHeader />

      {/* Hero */}
      <section className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          인플루언서 마케팅,{" "}
          <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            데이터로 시작하세요
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          AI가 검증한 인플루언서 검색부터 캠페인 성과 추적까지 한 곳에서
        </p>
        <Link
          ref={heroCTARef}
          href="/signup"
          className="inline-flex items-center justify-center w-full h-12 px-8 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-base transition-opacity hover:opacity-90"
        >
          무료로 시작하기
        </Link>
      </section>

      {/* Trust metrics */}
      <section className="max-w-lg mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "15,000+", label: "크리에이터" },
            { value: "500+", label: "브랜드" },
            { value: "1,200+", label: "캠페인" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <p className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role split */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          누구를 위한 서비스인가요?
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          역할을 선택하면 맞춤형 기능을 안내해 드립니다
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/signup?role=brand"
            className="bg-card border-2 border-brand-purple rounded-xl p-6 hover:bg-card-hover transition-colors"
          >
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="text-lg font-bold mb-1">브랜드 / 광고주</h3>
            <p className="text-sm text-muted-foreground">
              AI로 검증된 인플루언서를 찾고 캠페인을 관리하세요
            </p>
            <p className="text-brand-purple text-sm font-semibold mt-3">
              브랜드로 시작하기 →
            </p>
          </Link>
          <Link
            href="/signup?role=creator"
            className="bg-card border-2 border-brand-pink rounded-xl p-6 hover:bg-card-hover transition-colors"
          >
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-bold mb-1">크리에이터 / 인플루언서</h3>
            <p className="text-sm text-muted-foreground">
              내 채널 데이터를 분석하고 브랜드 제안을 받으세요
            </p>
            <p className="text-brand-pink text-sm font-semibold mt-3">
              크리에이터로 시작하기 →
            </p>
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          왜 InfluSync인가요?
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              icon: "🔍",
              title: "AI 인플루언서 검증",
              desc: "가짜 팔로워, 참여율 분석으로 진짜 인플루언서만 추려드립니다",
            },
            {
              icon: "📊",
              title: "실시간 성과 트래킹",
              desc: "캠페인 진행 중 조회수, 클릭, 전환을 실시간으로 확인하세요",
            },
            {
              icon: "💰",
              title: "예상 광고단가 산출",
              desc: "AI가 적정 광고비를 미리 계산해 협상 시 참고하세요",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-card border border-border rounded-xl p-5"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">지금 무료로 시작하세요</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          신용카드 없이 바로 시작할 수 있습니다
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center w-full h-12 px-8 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-base transition-opacity hover:opacity-90"
        >
          무료로 시작하기
        </Link>
      </section>

      <LandingStickyCTA
        text="무료로 시작하기"
        link="/signup"
        heroCTARef={heroCTARef}
      />
    </div>
  );
}
