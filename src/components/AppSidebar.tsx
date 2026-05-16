import {
  LayoutGrid,
  Phone,
  BookOpen,
  Sparkles,
  Settings2,
  MessageSquareText,
  MessageCircle,
  Info,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FeedbackDialog } from "./FeedbackDialog";
import { FeedbackHistoryDialog } from "./FeedbackHistoryDialog";

const nav = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
    active: true,
    locked: false,
  },
  { id: "call-insights", label: "Call Insights", icon: Phone, locked: true },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    icon: BookOpen,
    locked: true,
  },
  { id: "prompts", label: "Prompts", icon: Sparkles, locked: true },
  { id: "boxy", label: "Boxy Controls", icon: Settings2, locked: true },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: Props) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 lg:hidden transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight text-foreground">Hintro</span>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.locked) {
                    toast.info(`${item.label} is available on a paid plan`);
                  }
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  item.active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.locked && <Info className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            <MessageSquareText className="h-4 w-4" />
            Feedback History
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            <MessageCircle className="h-4 w-4" />
            Feedback
          </button>
        </div>

        <div className="px-4 pb-5 pt-2">
          <button
            onClick={() => toast.info("Upgrade flow coming soon")}
            className="w-full rounded-md border border-sidebar-border bg-sidebar-accent/50 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            Upgrade
          </button>
        </div>
      </aside>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      <FeedbackHistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />
    </>
  );
}
