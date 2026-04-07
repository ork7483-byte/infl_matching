import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glow = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-card border border-border rounded-2xl p-6 ${
          hover
            ? "transition-all duration-300 hover:border-brand-purple/30 hover:bg-card-hover cursor-pointer"
            : ""
        } ${glow ? "shadow-glow" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
