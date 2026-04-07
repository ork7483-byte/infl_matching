interface LandingPainPointProps {
  emoji: string;
  title: string;
  description: string;
}

export default function LandingPainPoint({
  emoji,
  title,
  description,
}: LandingPainPointProps) {
  return (
    <div className="flex items-start gap-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5">
      <span className="text-2xl flex-shrink-0">{emoji}</span>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
