"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

type ContentType = "FEED" | "REEL" | "STORY" | "ANY";
type RewardType = "PAID" | "PRODUCT" | "MIXED";

const CATEGORIES = ["뷰티", "패션", "라이프스타일", "음식", "여행", "스포츠/피트니스", "테크", "게임", "육아", "반려동물", "인테리어", "자동차", "금융", "교육"];

interface FormData {
  name: string;
  description: string;
  hashtags: string;
  contentType: ContentType;
  budget: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  categories: string[];
  rewardType: RewardType;
  rewardAmount: string;
  requirements: string;
}

interface FormErrors {
  name?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  categories?: string;
}

const initialForm: FormData = {
  name: "",
  description: "",
  hashtags: "",
  contentType: "ANY",
  budget: "",
  startDate: "",
  endDate: "",
  isPublic: true,
  categories: [],
  rewardType: "PAID",
  rewardAmount: "",
  requirements: "",
};

export default function NewCampaignPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "캠페인명을 입력하세요.";
    if (!form.budget || isNaN(Number(form.budget)) || Number(form.budget) <= 0)
      newErrors.budget = "유효한 예산을 입력하세요.";
    if (!form.startDate) newErrors.startDate = "시작일을 선택하세요.";
    if (!form.endDate) newErrors.endDate = "종료일을 선택하세요.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      newErrors.endDate = "종료일은 시작일 이후여야 합니다.";
    if (form.categories.length === 0) newErrors.categories = "카테고리를 최소 1개 선택하세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          rewardAmount: form.rewardAmount ? Number(form.rewardAmount) : undefined,
          hashtags: form.hashtags.split(/[\s,]+/).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "캠페인 생성에 실패했습니다.");
      }
      const data = await res.json();
      const id = data.id ?? data.campaign?.id ?? "1";
      router.push(`/dashboard/brand/campaigns/${id}`);
    } catch (err) {
      // Fallback: navigate to campaign list on API not yet implemented
      if (err instanceof Error && err.message.includes("404")) {
        router.push("/dashboard/brand/campaigns");
      } else {
        setSubmitError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-purple transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-red-400 mt-1";

  return (
    <DashboardLayout role="brand">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">새 캠페인 만들기</h1>
          <p className="text-muted-foreground mt-1 text-sm">캠페인 정보를 입력하고 인플루언서와 협업을 시작하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">기본 정보</h2>

            <div>
              <label className={labelClass}>캠페인명 <span className="text-red-400">*</span></label>
              <input
                type="text"
                className={inputClass}
                placeholder="캠페인 이름을 입력하세요"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>설명</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="캠페인 목표, 요구사항 등을 설명하세요"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>해시태그</label>
              <input
                type="text"
                className={inputClass}
                placeholder="#브랜드명 #캠페인 (공백 또는 쉼표로 구분)"
                value={form.hashtags}
                onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>콘텐츠 유형</label>
              <div className="flex gap-2 flex-wrap">
                {(["FEED", "REEL", "STORY", "ANY"] as ContentType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, contentType: type })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.contentType === type
                        ? "bg-brand-purple border-brand-purple text-white"
                        : "bg-background border-border text-muted-foreground hover:border-brand-purple/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget & Dates */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">예산 및 일정</h2>

            <div>
              <label className={labelClass}>예산 (원) <span className="text-red-400">*</span></label>
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="예: 3000000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
              {errors.budget && <p className={errorClass}>{errors.budget}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>시작일 <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
                {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
              </div>
              <div>
                <label className={labelClass}>종료일 <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
                {errors.endDate && <p className={errorClass}>{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Categories & Visibility */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">카테고리 및 공개 설정</h2>

            <div>
              <label className={labelClass}>카테고리 <span className="text-red-400">*</span></label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.categories.includes(cat)
                        ? "bg-brand-purple/20 border-brand-purple text-brand-purple"
                        : "bg-background border-border text-muted-foreground hover:border-brand-purple/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.categories && <p className={errorClass}>{errors.categories}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">마켓플레이스 공개</p>
                <p className="text-xs text-muted-foreground mt-0.5">인플루언서가 캠페인을 검색하고 지원할 수 있습니다.</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.isPublic ? "bg-brand-purple" : "bg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form.isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reward */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">보상 설정</h2>

            <div>
              <label className={labelClass}>보상 유형</label>
              <div className="flex gap-2">
                {(["PAID", "PRODUCT", "MIXED"] as RewardType[]).map((type) => {
                  const labels = { PAID: "현금 지급", PRODUCT: "제품 제공", MIXED: "현금+제품" };
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, rewardType: type })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.rewardType === type
                          ? "bg-brand-purple border-brand-purple text-white"
                          : "bg-background border-border text-muted-foreground hover:border-brand-purple/50"
                      }`}
                    >
                      {labels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {(form.rewardType === "PAID" || form.rewardType === "MIXED") && (
              <div>
                <label className={labelClass}>보상 금액 (원)</label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  placeholder="인플루언서당 보상 금액"
                  value={form.rewardAmount}
                  onChange={(e) => setForm({ ...form, rewardAmount: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>인플루언서 요건</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="최소 팔로워 수, 콘텐츠 카테고리, 기타 조건 등"
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              />
            </div>
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:bg-card-hover transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "생성 중..." : "캠페인 만들기"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
