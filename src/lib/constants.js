export const STATUSES = ["Unassigned", "In Progress", "Completed"];

// pill class names (match styles.css)
export const PC = {
  Unassigned: "p-un",
  "In Progress": "p-prog",
  Completed: "p-done",
};

// concrete colors (mirror the CSS :root vars) for SVG / inline use
export const COLORS = {
  unassigned: "#6B7785",
  progress: "#D08700",
  complete: "#2E9E5B",
  overdue: "#C73E3E",
  ink: "#14302A",
  inkSoft: "#54635D",
  track: "#EEF2F0",
};

export const STATUS_COLOR = {
  Unassigned: COLORS.unassigned,
  "In Progress": COLORS.progress,
  Completed: COLORS.complete,
};

// seed data (used in localStorage fallback mode, or to bootstrap an empty sheet)
// `completed` = the date a task was marked Completed (blank while still open).
export const SEED = [
  { id: 1, name: "Taxpayer registration & TIN onboarding", owner: "Amara Okeke", status: "Completed", start: "2026-04-06", due: "2026-05-01", completed: "2026-04-30" },
  { id: 2, name: "e-Filing form builder (PIT / CIT / VAT)", owner: "Daniel Eze", status: "In Progress", start: "2026-05-04", due: "2026-06-19" },
  { id: 3, name: "TIN validation service integration", owner: "Amara Okeke", status: "In Progress", start: "2026-05-18", due: "2026-06-12" },
  { id: 4, name: "Payment gateway integration (Remita / Interswitch)", owner: "Tunde Bello", status: "In Progress", start: "2026-05-25", due: "2026-06-09" },
  { id: 5, name: "Tax assessment & liability engine", owner: "", status: "Unassigned", start: "2026-06-15", due: "2026-07-17" },
  { id: 6, name: "Penalty & interest calculation module", owner: "", status: "Unassigned", start: "2026-06-22", due: "2026-07-24" },
  { id: 7, name: "Document upload & e-signature", owner: "Ngozi Adamu", status: "In Progress", start: "2026-05-11", due: "2026-06-26" },
  { id: 8, name: "Audit log & compliance reporting", owner: "", status: "Unassigned", start: "2026-07-01", due: "2026-08-07" },
  { id: 9, name: "Notification & filing-deadline reminders", owner: "Daniel Eze", status: "Completed", start: "2026-04-13", due: "2026-05-15", completed: "2026-05-14" },
  { id: 10, name: "Role-based access & admin permissions", owner: "Tunde Bello", status: "Completed", start: "2026-04-20", due: "2026-05-22", completed: "2026-05-20" },
  { id: 11, name: "Legacy data migration (FIRS records)", owner: "Ngozi Adamu", status: "In Progress", start: "2026-05-28", due: "2026-06-30" },
  { id: 12, name: "Analytics dashboard & MIS reports", owner: "", status: "Unassigned", start: "2026-07-06", due: "2026-08-14" },
  { id: 13, name: "Mobile-responsive filing UI", owner: "Olawole Akorede", status: "Completed", start: "2026-05-20", due: "2026-06-16", completed: "2026-06-24" },
  { id: 14, name: "Security pen-test remediation", owner: "Tunde Bello", status: "Unassigned", start: "2026-06-10", due: "2026-06-11" },
  { id: 15, name: "Third-party accounting API (QuickBooks/Sage)", owner: "", status: "Unassigned", start: "2026-07-13", due: "2026-08-21" },
];
