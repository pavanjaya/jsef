import type { ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  from?: "left" | "right";
  delay?: 1 | 2 | 3 | 4 | 5;
  children?: ReactNode;
  [key: string]: unknown;
};

export default function Reveal({ as, className = "", from, delay, children, ...rest }: RevealProps) {
  void from;
  void delay;
  const Tag = as || "div";
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
}
