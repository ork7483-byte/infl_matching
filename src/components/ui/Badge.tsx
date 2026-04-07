interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "purple" | "pink" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]",
    purple: "bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]",
    pink: "bg-[#e94560]/10 border-[#e94560]/20 text-[#e94560]",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    danger: "bg-danger/10 border-danger/20 text-danger",
    info: "bg-info/10 border-info/20 text-info",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center border rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
