export const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Local calendar date as "YYYY-MM-DD" (matches the format stored on tasks).
export function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const todayStr = () => isoDate(today());

// Monday→Friday (working week) range containing `d` (defaults to today).
export function thisWeekRange(d = today()) {
  const dow = (d.getDay() + 6) % 7; // 0 = Monday … 6 = Sunday
  const mon = new Date(d);
  mon.setDate(d.getDate() - dow);
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  return { from: isoDate(mon), to: isoDate(fri) };
}

// Working-week range `weeks` away from today (0 = this week, -1 = last week).
export function weekRange(weeks = 0) {
  const d = today();
  d.setDate(d.getDate() + weeks * 7);
  return thisWeekRange(d);
}

// First occurrence of weekday `dow` (0=Sun … 6=Sat) strictly after `dateStr`.
// Used to find a week's "report day" (the day last week's report goes out).
export function nextWeekday(dateStr, dow) {
  const d = new Date(dateStr + "T00:00:00");
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() !== dow);
  return isoDate(d);
}

export function fmt(s) {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysTo(s) {
  if (!s) return null;
  return Math.round((new Date(s + "T00:00:00") - today()) / 864e5);
}

export function weekRef() {
  const d = today();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const wk = Math.ceil(((d - jan1) / 864e5 + jan1.getDay() + 1) / 7);
  return `FILEAM-WK${String(wk).padStart(2, "0")}-${d.getFullYear()}`;
}

export const taskCode = (id) => `FILEAM-T${String(id).padStart(3, "0")}`;
