import { useEffect, useState } from "react";
import { Star, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFeedback, type FeedbackEntry } from "@/lib/feedback-store";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function FeedbackHistoryDialog({ open, onOpenChange }: Props) {
  const [items, setItems] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    if (open) setItems(getFeedback());
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your feedback</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-foreground">No feedback yet</div>
            <p className="max-w-xs text-xs text-muted-foreground">
              Once you submit feedback from the sidebar, it'll show up here.
            </p>
          </div>
        ) : (
          <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {items.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-border bg-card p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${
                          n <= entry.rating
                            ? "fill-foreground text-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {formatWhen(entry.createdAt)}
                  </span>
                </div>
                <div className="text-xs font-medium text-foreground">{entry.category}</div>
                <p className="mt-1 text-sm text-foreground/90">{entry.message}</p>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
