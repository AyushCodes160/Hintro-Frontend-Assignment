import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

type Tone = "pink" | "blue" | "green" | "orange" | "purple";

const toneStyles: Record<Tone, CSSProperties> = {
  pink: { backgroundColor: "var(--stat-pink-bg)", color: "var(--stat-pink)" },
  blue: { backgroundColor: "var(--stat-blue-bg)", color: "var(--stat-blue)" },
  green: { backgroundColor: "var(--stat-green-bg)", color: "var(--stat-green)" },
  orange: { backgroundColor: "var(--stat-orange-bg)", color: "var(--stat-orange)" },
  purple: { backgroundColor: "var(--stat-purple-bg)", color: "var(--stat-purple)" },
};

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
}

export function StatCard({ label, value, icon: Icon, tone }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-shadow hover:shadow-sm">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={toneStyles[tone]}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-base font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}
