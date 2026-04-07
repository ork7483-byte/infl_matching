"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LandingMinimalHeader from "@/components/landing/LandingMinimalHeader";
import LandingStickyCTA from "@/components/landing/LandingStickyCTA";
import LandingPainPoint from "@/components/landing/LandingPainPoint";
import LandingSolution from "@/components/landing/LandingSolution";

export default function CreatorLandingPage() {
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
      <LandingMinimalHeader
        ctaText="크리에이터 가입"
        ctaLink="/signup?role=creator"
      />

      {/* Hero */}
      <section className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-xs font-semibold px-3 py-1 rounded-full mb-4">
          크리에이터 / 인플루언서 전용
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          당신의 영향력,{" "}
          <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            정확한 숫자로 증명하세요
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          AI가 분석한 데이터로 브랜드에게 어필하세요
        </p>
        <Link
          ref={heroCTARef}
          href="/signup?role=creator"
          className="inline-flex items-center justify-center w-full h-12 px-8 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-base transition-opacity hover:opacity-90"
        >
          무료로 시작하기
        </Link>
      </section>

      {/* Pain points */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          이런 불편함 있었죠?
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          크리에이터들이 공통으로 겪는 불편함입니다
        </p>
        <div className="flex flex-col gap-3">
          <LandingPainPoint
            emoji="😤"
            title="미디어킷 만드는데 Canva로 3시간"
            description="브랜드 제안 올 때마다 미디어킷 업데이트에 너무 많은 시간이 걸립니다"
          />
          <LandingPainPoint
            emoji="😤"
            title="내 적정 광고비를 모르겠음"
            description="다른 크리에이터는 얼마 받는지, 내 단가가 적절한지 기준이 없습니다"
          />
          <LandingPainPoint
            emoji="😤"
            title="브랜드 제안이 안 들어옴"
            description="좋은 콘텐츠를 만들어도 브랜드에서 먼저 찾아오지 않아 답답합니다"
          />
          <LandingPainPoint
            emoji="😤"
            title="정산 관리를 엑셀로 하는 중"
            description="캠페인별 수익과 정산 내역을 엑셀로 관리하느라 실수가 잦습니다"
          />
        </div>
      </section>

      {/* Solutions */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Inflix이 해결합니다
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
          <LandingSolution
            title="미디어킷 1분 만에 자동 생성 + PDF"
            description="채널 데이터를 연동하면 전문적인 미디어킷이 자동으로 완성됩니다"
          />
          <LandingSolution
            title="AI가 내 적정 단가 자동 산출"
            description="구독자 수, 참여율, 카테고리 기반으로 적정 광고 단가를 계산합니다"
          />
          <LandingSolution
            title="캠페인 마켓플레이스에서 직접 브랜드에 지원"
            description="브랜드를 기다리지 마세요. 원하는 캠페인에 직접 지원할 수 있습니다"
          />
          <LandingSolution
            title="수익/정산 한 곳에서 관리"
            description="캠페인별 수익, 정산 현황, 지급 예정일을 한 대시보드에서 확인하세요"
          />
        </div>
      </section>

      {/* Growth chart preview */}
      <section className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-muted-foreground mb-4">
            채널 성장 분석 미리보기
          </p>
          {/* Mock bar chart */}
          <div className="flex items-end gap-2 h-24">
            {[40, 55, 45, 70, 60, 80, 90, 75, 95, 85, 100, 88].map(
              (h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 11
                        ? "linear-gradient(180deg, #7c3aed, #e94560)"
                        : "rgba(124,58,237,0.25)",
                  }}
                />
              )
            )}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted">1월</span>
            <span className="text-xs text-muted">12월</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">
          지금 바로 내 분석 데이터를 확인해보세요
        </h2>
        <p className="text-muted-foreground mb-8 text-sm">
          무료로 시작해 내 채널의 가치를 숫자로 확인하세요
        </p>
        <Link
          href="/signup?role=creator"
          className="inline-flex items-center justify-center w-full h-12 px-8 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-base transition-opacity hover:opacity-90 mb-4"
        >
          무료 가입하기
        </Link>
        <Link
          href="/"
          className="block text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          먼저 둘러보기 →
        </Link>
      </section>

      <LandingStickyCTA
        text="무료 가입하기"
        link="/signup?role=creator"
        heroCTARef={heroCTARef}
      />
    </div>
  );
}
