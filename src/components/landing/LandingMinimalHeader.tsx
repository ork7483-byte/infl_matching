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
    <header className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-lg mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
          InfluSync
        </Link>
        <Link
          href={ctaLink}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white text-sm font-semibold transition-opacity hover:opacity-90"
        >
          {ctaText}
        </Link>
      </div>
    </header>
  );
}
