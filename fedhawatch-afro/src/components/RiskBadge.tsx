import { RiskLevel } from "@/lib/data";
import { cn } from "@/lib/utils";

const riskConfig: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  GREEN: { bg: "bg-risk-green", text: "text-accent-foreground", label: "GREEN" },
  YELLOW: { bg: "bg-risk-yellow", text: "text-foreground", label: "YELLOW" },
  RED: { bg: "bg-risk-red", text: "text-accent-foreground", label: "RED" },
  BLUE: { bg: "bg-risk-blue", text: "text-accent-foreground", label: "BLUE" },
  USI: { bg: "bg-risk-usi", text: "text-accent-foreground", label: "USI" },
  INSUFFICIENT_DATA: { bg: "bg-risk-insufficient", text: "text-accent-foreground", label: "INSUFFICIENT DATA" },
};

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
