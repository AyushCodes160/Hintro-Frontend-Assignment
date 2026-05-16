// Format a duration given in seconds as the Figma convention: "14m 22sec"
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}sec`;
  return `${s}sec`;
}

// "2 days ago", "5 hours ago", etc — used for Last Session card
export function formatRelative(iso: string | undefined | null): string {
  if (!iso) return "-";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (minutes >= 1) return `${minutes} min ago`;
  return "just now";
}

// "11:00 am" — time only
export function formatTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

// "April 29th"
export function formatDateHeading(iso: string): string {
  const d = new Date(iso);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = d.getDate();
  const suffix =
    day >= 11 && day <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  return `${months[d.getMonth()]} ${day}${suffix}`;
}

export function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
