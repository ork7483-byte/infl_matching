"use client";

import { useSession } from "next-auth/react";

interface MaskedValueProps {
  value: string | number | null | undefined;
  width?: string;
  className?: string;
  forceMask?: boolean;
}

export default function MaskedValue({
  value,
  width = "60px",
  className = "",
  forceMask = false,
}: MaskedValueProps) {
  const { data: session } = useSession();
  const isMasked = forceMask || !session;

  if (isMasked || value === null || value === undefined) {
    return (
      <span
        className={`masked-value ${className}`}
        style={{ minWidth: width }}
      >
        ████
      </span>
    );
  }

  return <span className={className}>{value}</span>;
}
