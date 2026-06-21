export const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

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
