export function initials(n) {
  return n
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function avColor(n) {
  const h = [...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `hsl(${h} 42% 42%)`;
}

export function counts(tasks, daysTo) {
  const c = { Unassigned: 0, "In Progress": 0, Completed: 0, overdue: 0 };
  tasks.forEach((t) => {
    c[t.status]++;
    if (t.status !== "Completed") {
      const d = daysTo(t.due);
      if (d !== null && d < 0) c.overdue++;
    }
  });
  return c;
}
