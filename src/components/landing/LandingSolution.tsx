interface LandingSolutionProps {
  title: string;
  description: string;
}

export default function LandingSolution({
  title,
  description,
}: LandingSolutionProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xl flex-shrink-0">✅</span>
        <p className="font-bold text-foreground">{title}</p>
      </div>
      <p className="text-muted-foreground text-sm pl-8 leading-relaxed">{description}</p>
    </div>
  );
}
