"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface LandingStickyCTAProps {
  text: string;
  link: string;
  heroCTARef?: React.RefObject<HTMLElement | null>;
}

export default function LandingStickyCTA({
  text,
  link,
  heroCTARef,
}: LandingStickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetEl = heroCTARef?.current ?? sentinelRef.current;
    if (!targetEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(targetEl);
    return () => observer.disconnect();
  }, [heroCTARef]);

  return (
    <>
      {/* Sentinel for scroll detection when no heroCTARef provided */}
      <div ref={sentinelRef} className="h-0 w-0 pointer-events-none" />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white border-t border-[#E5E7EB] shadow-lg px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom,12px))]">
          <div className="max-w-lg mx-auto">
            <Link
              href={link}
              className="flex items-center justify-center w-full h-12 px-8 rounded-xl bg-[#7c3aed] text-white font-semibold text-base hover:bg-[#6d28d9] transition-colors cursor-pointer"
            >
              {text}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
