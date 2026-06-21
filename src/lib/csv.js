import { weekRef, taskCode } from "./dates";

export function exportCSV(tasks) {
  const head = ["Task ID", "Task", "Owner", "Status", "Start Date", "Due Date"];
  const rows = tasks.map((t) => [
    taskCode(t.id),
    t.name,
    t.owner || "Unassigned",
    t.status,
    t.start,
    t.due,
  ]);
  const csv = [head, ...rows]
    .map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `${weekRef()}.csv`;
  a.click();
}
