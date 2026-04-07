"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LandingMinimalHeader from "@/components/landing/LandingMinimalHeader";
import LandingStickyCTA from "@/components/landing/LandingStickyCTA";
import LandingPainPoint from "@/components/landing/LandingPainPoint";
import LandingSolution from "@/components/landing/LandingSolution";

export default function BrandLandingPage() {
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
      <LandingMinimalHeader ctaText="브랜드 가입" ctaLink="/signup?role=brand" />

      {/* Hero */}
      <section className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold px-3 py-1 rounded-full mb-4">
          브랜드 / 광고주 전용
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          아직도 감으로{" "}
          <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            인플루언서 고르시나요?
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          데이터로 검증된 인플루언서, AI가 찾아드립니다
        </p>
        <Link
          ref={heroCTARef}
          href="/signup?role=brand"
          className="inline-flex items-center justify-center w-full h-12 px-8 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-base transition-opacity hover:opacity-90"
        >
          무료로 시작하기
        </Link>
      </section>

      {/* Pain points */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          이런 고민 있으셨죠?
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          브랜드 담당자들이 가장 많이 겪는 문제들입니다
        </p>
        <div className="flex flex-col gap-3">
          <LandingPainPoint
            emoji="😤"
            title="팔로워 많은데 광고 효과는 0"
            description="팔로워 수만 보고 계약했다가 도달률이 기대 이하인 경험, 있으시죠?"
          />
          <LandingPainPoint
            emoji="😤"
            title="가짜 팔로워인지 확인할 방법이 없음"
            description="팔로워가 진짜인지 가짜인지 일일이 확인할 방법이 없었습니다"
          />
          <LandingPainPoint
            emoji="😤"
            title="캠페인 끝나면 리포트 만드느라 야근"
            description="데이터 수집, 정리, 시각화까지 리포트 하나에 몇 시간씩 쏟고 있습니다"
          />
          <LandingPainPoint
            emoji="😤"
            title="적정 광고비를 모르겠음"
            description="인플루언서마다 제각각인 광고비, 적정선이 어딘지 알 수가 없습니다"
          />
        </div>
      </section>

      {/* Solutions */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          InfluSync이 해결합니다
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
          <LandingSolution
            title="AQS 점수로 가짜 팔로워 자동 탐지"
            description="AI가 팔로워 품질 점수(AQS)를 자동 계산해 진짜 영향력을 측정합니다"
          />
          <LandingSolution
            title="캠페인 성과 실시간 자동 트래킹"
            description="조회수, 좋아요, 댓글, 클릭, 전환까지 자동으로 수집하고 표시합니다"
          />
          <LandingSolution
            title="PDF 리포트 원클릭 자동 생성"
            description="클릭 한 번으로 전문적인 PDF 리포트가 완성됩니다. 야근은 이제 그만"
          />
          <LandingSolution
            title="AI가 예상 광고단가 미리 산출"
            description="채널 규모, 참여율, 카테고리를 분석해 적정 단가를 미리 알려드립니다"
          />
        </div>
      </section>

      {/* Screenshot preview placeholder */}
      <section className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-sm font-medium">
                대시보드 미리보기
              </p>
              <p className="text-xs text-muted mt-1">
                실제 화면과 유사한 인터페이스
              </p>
            </div>
          </div>
          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-2 py-3">
            <span className="w-2 h-2 rounded-full bg-brand-purple" />
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">
          지금 바로 인플루언서를 검색해보세요
        </h2>
        <p className="text-muted-foreground mb-8 text-sm">
          무료 플랜으로 시작해 언제든 업그레이드 가능합니다
        </p>
        <Link
          href="/signup?role=brand"
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
        link="/signup?role=brand"
        heroCTARef={heroCTARef}
      />
    </div>
  );
}
