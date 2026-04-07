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
        className={`bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-sm ${
          hover
            ? "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
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
