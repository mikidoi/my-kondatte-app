export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getWeekStart(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return toDateStr(d);
}

export function shiftWeek(weekStart: string, weeks: number): string {
  const d = parseLocalDate(weekStart);
  d.setDate(d.getDate() + weeks * 7);
  return toDateStr(d);
}

export function getColumnDate(weekStartDate: string, colIndex: number): Date {
  const d = parseLocalDate(weekStartDate);
  d.setDate(d.getDate() + colIndex);
  return d;
}

export function formatDateRange(weekStartDate: string): string {
  const sunday = parseLocalDate(weekStartDate);
  const saturday = new Date(sunday);
  saturday.setDate(saturday.getDate() + 6);
  const start = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(sunday);
  const end = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(saturday);
  return `${start} – ${end}`;
}
