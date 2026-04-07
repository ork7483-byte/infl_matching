import Link from "next/link";

interface LandingMinimalHeaderProps {
  ctaText?: string;
  ctaLink?: string;
}

export default function LandingMinimalHeader({
  ctaText = "가입하기",
  ctaLink = "/signup",
}: LandingMinimalHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-lg mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          <span className="text-[#111827]">Infl</span><span className="text-[#7c3aed]">ix</span>
        </Link>
        <Link
          href={ctaLink}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </header>
  );
}
