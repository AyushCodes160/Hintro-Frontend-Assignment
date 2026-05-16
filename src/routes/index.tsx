import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, Menu, PieChart, Play, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { formatDuration, formatRelative } from "@/lib/format";
import { AppSidebar } from "@/components/AppSidebar";
import { StatCard } from "@/components/StatCard";
import { RecentCalls } from "@/components/RecentCalls";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hintro" },
      { name: "description", content: "Hintro dashboard for call insights and recent sessions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { userId } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profileQ = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => api.profile(userId),
  });
  const statsQ = useQuery({
    queryKey: ["stats", userId],
    queryFn: () => api.stats(userId),
  });
  const historyQ = useQuery({
    queryKey: ["history", userId],
    queryFn: () => api.history(userId, 10),
  });

  const firstName = profileQ.data?.firstName;
  const stats = statsQ.data;
  const sessions = historyQ.data?.callSessions ?? [];

  const lastSessionIso = stats?.lastSession?.[0];

  // Surface API failures so users aren't stuck with "—" forever
  useEffect(() => {
    const err = profileQ.error ?? statsQ.error ?? historyQ.error;
    if (err) toast.error("Couldn't reach the Hintro API. Retrying…");
  }, [profileQ.error, statsQ.error, historyQ.error]);

  const startCall = () => toast.info("Start New Call — coming soon");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1.5 text-foreground hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info("Tutorial video coming soon")}
              className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent sm:flex"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch Tutorial
            </button>
            <UserAvatarMenu firstName={firstName} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-8">
          {/* Welcome */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                Hi, {firstName ?? "there"} <span aria-hidden>👋</span> Welcome to Hintro
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ready to make your next call smarter?
              </p>
            </div>
            <button
              onClick={startCall}
              className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Start New Call
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Sessions"
              value={stats ? String(stats.totalSessions) : "—"}
              icon={PieChart}
              tone="pink"
            />
            <StatCard
              label="Average Duration"
              value={stats ? formatDuration(stats.averageDuration) : "—"}
              icon={Clock}
              tone="blue"
            />
            <StatCard
              label="AI Used"
              value={
                stats
                  ? stats.totalAIInteractions > 0
                    ? `${stats.totalAIInteractions} times`
                    : "0"
                  : "—"
              }
              icon={Sparkles}
              tone="green"
            />
            <StatCard
              label="Last Session"
              value={lastSessionIso ? formatRelative(lastSessionIso) : "-"}
              icon={CalendarIcon}
              tone="orange"
            />
          </div>

          <RecentCalls sessions={sessions} loading={historyQ.isLoading} onStartCall={startCall} />
        </main>

        <footer className="border-t border-border px-6 py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hintro. Made in India 🇮🇳
        </footer>
      </div>
    </div>
  );
}
