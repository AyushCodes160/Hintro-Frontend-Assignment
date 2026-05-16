import { Calendar, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import type { CallSession } from "@/lib/api";
import { dateKey, formatDateHeading, formatTime } from "@/lib/format";

interface Props {
  sessions: CallSession[];
  loading: boolean;
  onStartCall?: () => void;
}

function Waveform() {
  // Static decorative waveform matching the Figma rows
  return (
    <svg width="38" height="10" viewBox="0 0 38 10" fill="none" aria-hidden>
      {[2, 5, 3, 7, 4, 6, 3, 8, 4, 5, 3, 6].map((h, i) => (
        <rect
          key={i}
          x={i * 3}
          y={(10 - h) / 2}
          width="1.5"
          height={h}
          rx="0.75"
          fill="currentColor"
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

export function RecentCalls({ sessions, loading, onStartCall }: Props) {
  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">Recent calls</h2>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">Recent calls</h2>
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium text-foreground">No Recent Calls</div>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Connect your Google Calendar to see upcoming meetings, get reminders, and join calls
            directly from Hintro.
          </p>
          <button
            onClick={onStartCall}
            className="mt-4 rounded-md border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Start a Call
          </button>
        </div>
      </div>
    );
  }

  // Group by date
  const groups = new Map<string, { heading: string; items: CallSession[] }>();
  for (const s of sessions) {
    const key = dateKey(s.started_at);
    if (!groups.has(key)) {
      groups.set(key, { heading: formatDateHeading(s.started_at), items: [] });
    }
    groups.get(key)!.items.push(s);
  }

  return (
    <div className="mt-10">
      <h2 className="mb-5 text-center text-sm font-medium text-muted-foreground">Recent calls</h2>
      <div className="space-y-6">
        {Array.from(groups.values()).map((group) => (
          <div key={group.heading}>
            <div className="mb-2 text-xs text-muted-foreground">{group.heading}</div>
            <ul className="space-y-2">
              {group.items.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-accent/40"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
                    style={{ backgroundColor: "var(--brand-purple-bg)" }}
                  >
                    {(s.participants?.[0]?.name ?? s.client ?? "C").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {s.description || s.client || "Call"}
                    </div>
                    <div className="text-muted-foreground">
                      <Waveform />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatTime(s.started_at)}</div>
                  <button
                    onClick={() => toast.info("Call options coming soon")}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Call options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
