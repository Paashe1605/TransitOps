import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`glass-card p-6 rounded-2xl border transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
