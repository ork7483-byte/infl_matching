"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageStatus = "draft" | "sent" | "opened" | "replied";
type OutreachTab = "inbox" | "sent" | "templates";

interface Message {
  id: string;
  recipient: string;
  recipientName: string;
  subject: string;
  body: string;
  status: MessageStatus;
  date: string;
  preview: string;
}

interface InboxMessage {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  body: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SENT: Message[] = [
  {
    id: "m1", recipient: "soyeon_life", recipientName: "김소연",
    subject: "Inflix 브랜드 협업 제안드립니다",
    body: "안녕하세요 김소연님, 저희 Inflix 브랜드의 신제품 캠페인에 함께해 주실 수 있을까요?",
    preview: "안녕하세요 김소연님, 저희 Inflix 브랜드의...",
    status: "replied", date: "2026-04-03",
  },
  {
    id: "m2", recipient: "traveljun", recipientName: "박준혁",
    subject: "여름 캠페인 협업 제안",
    body: "안녕하세요 박준혁님, 여름 시즌 콘텐츠 협업을 제안드립니다.",
    preview: "안녕하세요 박준혁님, 여름 시즌 콘텐츠...",
    status: "opened", date: "2026-04-04",
  },
  {
    id: "m3", recipient: "fitmin_kr", recipientName: "이민지",
    subject: "[재연락] 헬스 브랜드 협업",
    body: "지난번에 말씀드렸던 협업 건 다시 한번 연락드립니다.",
    preview: "지난번에 말씀드렸던 협업 건 다시...",
    status: "sent", date: "2026-04-05",
  },
  {
    id: "m4", recipient: "yuri_fashion", recipientName: "강유리",
    subject: "콜라보 제안 초안",
    body: "",
    preview: "(초안) 패션 협업 관련...",
    status: "draft", date: "2026-04-06",
  },
];

const MOCK_INBOX: InboxMessage[] = [
  { id: "i1", from: "soyeon_life", fromName: "김소연", subject: "Re: Inflix 브랜드 협업 제안드립니다", preview: "안녕하세요! 관심 있습니다. 단가는 어느정도...", date: "2026-04-04", read: true },
  { id: "i2", from: "dahye_beauty", fromName: "최다혜", subject: "협업 문의드립니다", preview: "Inflix에서 연락이 올 줄 몰랐어요! 혹시...", date: "2026-04-05", read: false },
  { id: "i3", from: "chef_jinsoo", fromName: "오진수", subject: "음식 카테고리 협업 가능할까요?", preview: "요리 콘텐츠로 협업하면 좋을 것 같아서...", date: "2026-04-06", read: false },
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "t1", name: "첫 연락 (캐주얼)", category: "첫 연락",
    preview: "안녕하세요 {인플루언서이름}님! {브랜드명}입니다 :)",
    body: `안녕하세요 {인플루언서이름}님!\n\n저희는 {브랜드명}입니다. 평소에 콘텐츠 잘 보고 있었는데, 협업 제안드리고 싶어서 연락드렸어요.\n\n간단히 얘기 나눠볼 수 있을까요?\n\n감사합니다!`,
  },
  {
    id: "t2", name: "첫 연락 (공식)", category: "첫 연락",
    preview: "안녕하세요 {인플루언서이름}님, {브랜드명} 마케팅팀입니다.",
    body: `안녕하세요 {인플루언서이름}님,\n\n{브랜드명} 마케팅팀에서 연락드립니다.\n\n{인플루언서이름}님의 채널을 검토한 결과, 저희 브랜드의 가치와 잘 부합한다고 판단하여 협업을 제안드리고자 합니다.\n\n자세한 내용은 미팅을 통해 공유해 드릴 수 있습니다. 일정을 조율해 주시겠어요?\n\n감사합니다.`,
  },
  {
    id: "t3", name: "팔로업", category: "팔로업",
    preview: "{인플루언서이름}님, 이전 연락 관련해 다시 한번...",
    body: `안녕하세요 {인플루언서이름}님,\n\n이전에 {브랜드명} 협업 관련하여 연락드렸는데요, 혹시 검토해 보셨을까요?\n\n바쁘신 와중에 번거롭게 해드려 죄송합니다만, 좋은 조건으로 협업할 수 있으면 좋겠습니다.\n\n편하신 시간에 연락 주세요!`,
  },
  {
    id: "t4", name: "협상 단계", category: "협상",
    preview: "{인플루언서이름}님과의 협업 조건 관련하여...",
    body: `안녕하세요 {인플루언서이름}님,\n\n협업에 관심 가져주셔서 감사합니다!\n\n{브랜드명}에서 제안드리는 조건을 아래에 정리해 드렸습니다.\n\n• 콘텐츠 형식: [형식]\n• 포스팅 횟수: [횟수]\n• 제안 단가: [금액]\n• 일정: [날짜]\n\n검토 후 의견 주시면 감사하겠습니다!`,
  },
  {
    id: "t5", name: "계약 확정", category: "확정",
    preview: "{인플루언서이름}님, 최종 협업 확정 안내입니다.",
    body: `안녕하세요 {인플루언서이름}님,\n\n{브랜드명}과의 협업이 최종 확정되었습니다!\n\n계약서를 첨부 드리오니 내용 확인 후 서명 부탁드립니다.\n콘텐츠 가이드라인과 일정표도 함께 공유해 드리겠습니다.\n\n좋은 협업 기대합니다 :)`,
  },
];

const STATUS_BADGE: Record<MessageStatus, { label: string; className: string }> = {
  draft:   { label: "초안",     className: "bg-gray-100 text-gray-600" },
  sent:    { label: "발송됨",   className: "bg-blue-100 text-blue-700" },
  opened:  { label: "열람됨",   className: "bg-yellow-100 text-yellow-700" },
  replied: { label: "답장받음", className: "bg-green-100 text-green-700" },
};

const VARIABLES = ["{인플루언서이름}", "{브랜드명}"];

// ─── Compose Modal ────────────────────────────────────────────────────────────

function ComposeModal({ onClose, templates, initialTemplate }: { onClose: () => void; templates: Template[]; initialTemplate: Template | null }) {
  const [recipient, setRecipient] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate?.id ?? "");
  const [subject, setSubject] = useState(initialTemplate?.name ?? "");
  const [body, setBody] = useState(initialTemplate?.body ?? "");

  const applyTemplate = (id: string) => {
    const t = templates.find((t) => t.id === id);
    if (t) { setSubject(t.name); setBody(t.body); }
    setSelectedTemplate(id);
  };

  const insertVariable = (v: string) => {
    setBody((b) => b + v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-semibold text-[#111827]">새 메시지 작성</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Recipient */}
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">수신자 (@유저네임)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="@username"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>

          {/* Template Select */}
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">템플릿 선택 (선택사항)</label>
            <select
              value={selectedTemplate}
              onChange={(e) => applyTemplate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            >
              <option value="">템플릿 없음</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">제목</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="메시지 제목"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>

          {/* Variable Buttons */}
          <div>
            <p className="text-xs font-medium text-[#374151] mb-1.5">변수 삽입</p>
            <div className="flex gap-2 flex-wrap">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVariable(v)}
                  className="px-2.5 py-1 text-xs border border-[#7c3aed]/30 text-[#7c3aed] rounded-full hover:bg-[#EDE9FE] transition-colors font-mono"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">본문</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="메시지 본문을 입력하세요..."
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({ t, onUse }: { t: Template; onUse: (t: Template) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-[#111827]">{t.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7c3aed] font-medium">{t.category}</span>
          </div>
          <p className="text-xs text-[#6B7280] font-mono">{t.preview}</p>
        </div>
        <button
          onClick={() => onUse(t)}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors whitespace-nowrap"
        >
          사용하기
        </button>
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-[#7c3aed] hover:underline"
      >
        {expanded ? "접기" : "전체 보기"}
      </button>
      {expanded && (
        <pre className="text-xs text-[#374151] bg-[#F9FAFB] rounded-lg p-3 whitespace-pre-wrap font-sans leading-relaxed border border-[#E5E7EB]">
          {t.body}
        </pre>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OutreachPage() {
  const [tab, setTab] = useState<OutreachTab>("sent");
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prefilledTemplate, setPrefilledTemplate] = useState<Template | null>(null);

  const handleUseTemplate = (t: Template) => {
    setPrefilledTemplate(t);
    setComposeOpen(true);
  };

  const TABS: { key: OutreachTab; label: string }[] = [
    { key: "inbox",     label: "받은편지함" },
    { key: "sent",      label: "보낸메시지" },
    { key: "templates", label: "템플릿" },
  ];

  return (
    <DashboardLayout role="brand">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">아웃리치</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">인플루언서와 메시지를 주고받고 협업을 시작하세요.</p>
          </div>
          <button
            onClick={() => { setPrefilledTemplate(null); setComposeOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 메시지
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#F3F4F6] rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === t.key ? "bg-white text-[#7c3aed] shadow-sm" : "text-[#6B7280] hover:text-[#374151]"}`}
            >
              {t.label}
              {t.key === "inbox" && MOCK_INBOX.filter((m) => !m.read).length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-[#7c3aed] text-white rounded-full">
                  {MOCK_INBOX.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Inbox Tab ── */}
        {tab === "inbox" && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            {MOCK_INBOX.length === 0 ? (
              <div className="py-16 text-center text-[#9CA3AF] text-sm">받은 메시지가 없습니다.</div>
            ) : (
              MOCK_INBOX.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#F9FAFB] transition-colors ${i > 0 ? "border-t border-[#E5E7EB]" : ""} ${!msg.read ? "bg-[#FAF5FF]" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {msg.fromName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm ${!msg.read ? "font-semibold text-[#111827]" : "font-medium text-[#374151]"}`}>
                        {msg.fromName} (@{msg.from})
                      </span>
                      <span className="text-xs text-[#9CA3AF] flex-shrink-0">{msg.date}</span>
                    </div>
                    <p className={`text-sm truncate ${!msg.read ? "font-medium text-[#374151]" : "text-[#6B7280]"}`}>{msg.subject}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{msg.preview}</p>
                  </div>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-[#7c3aed] flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Sent Tab ── */}
        {tab === "sent" && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            {MOCK_SENT.map((msg, i) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(selectedMessage?.id === msg.id ? null : msg)}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[#F9FAFB] transition-colors ${i > 0 ? "border-t border-[#E5E7EB]" : ""} ${selectedMessage?.id === msg.id ? "bg-[#FAF5FF]" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] text-xs font-bold flex-shrink-0 mt-0.5">
                  {msg.recipientName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[#374151]">
                      {msg.recipientName} (@{msg.recipient})
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[msg.status].className}`}>
                        {STATUS_BADGE[msg.status].label}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{msg.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] truncate">{msg.subject}</p>
                  <p className="text-xs text-[#9CA3AF] truncate">{msg.preview}</p>
                  {selectedMessage?.id === msg.id && msg.body && (
                    <div className="mt-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Templates Tab ── */}
        {tab === "templates" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">총 {MOCK_TEMPLATES.length}개의 템플릿</p>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#7c3aed] text-[#7c3aed] rounded-lg hover:bg-[#EDE9FE] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 템플릿 만들기
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {MOCK_TEMPLATES.map((t) => (
                <TemplateCard key={t.id} t={t} onUse={handleUseTemplate} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <ComposeModal
          onClose={() => { setComposeOpen(false); setPrefilledTemplate(null); }}
          templates={MOCK_TEMPLATES}
          initialTemplate={prefilledTemplate}
        />
      )}
    </DashboardLayout>
  );
}
