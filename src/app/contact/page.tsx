"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    teamSize: "5명 이하",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // MVP: just simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-3">
                  Enterprise 플랜 문의
                </h1>
                <p className="text-[#6B7280]">
                  대규모 팀을 위한 맞춤형 솔루션을 안내드립니다
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    회사명 <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#111827] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]"
                    placeholder="예: 글로우업 코스메틱"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    담당자명 <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    required
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#111827] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    이메일 <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#111827] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]"
                    placeholder="email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    전화번호 <span className="text-[#6B7280] text-xs">(선택)</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#111827] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]"
                    placeholder="010-0000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    예상 사용 규모
                  </label>
                  <select
                    value={form.teamSize}
                    onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#111827] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] appearance-none"
                  >
                    <option>5명 이하</option>
                    <option>6~20명</option>
                    <option>21~50명</option>
                    <option>51~100명</option>
                    <option>100명 이상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    문의 내용 <span className="text-[#6B7280] text-xs">(선택)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#111827] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] resize-none"
                    placeholder="궁금한 점이나 요청 사항을 알려주세요"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "전송 중..." : "문의 보내기"}
                </button>

                <p className="text-center text-xs text-[#6B7280]">
                  * 1영업일 이내에 답변드립니다
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#111827] mb-3">문의가 접수되었습니다</h2>
              <p className="text-[#6B7280] mb-8">
                1영업일 이내에 입력하신 이메일로 연락드리겠습니다.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                홈으로 돌아가기
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
