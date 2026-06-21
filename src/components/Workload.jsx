import { COLORS } from "../lib/constants";

export default function Workload({ tasks }) {
  const map = {};
  tasks
    .filter((t) => t.status !== "Completed")
    .forEach((t) => {
      const k = t.owner || "Unassigned";
      map[k] = map[k] || { Unassigned: 0, "In Progress": 0 };
      map[k][t.status === "In Progress" ? "In Progress" : "Unassigned"]++;
    });

  const rows = Object.entries(map)
    .map(([n, v]) => ({ n, total: v.Unassigned + v["In Progress"], ...v }))
    .sort((a, b) => b.total - a.total);
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <div className="panel">
      <div className="panel-h">
        <h2>Workload by owner</h2>
        <span className="tk-id">open tasks</span>
      </div>
      <div className="panel-b">
        <div className="wl">
          {rows.length ? (
            rows.map((r) => (
              <div className="wl-row" key={r.n}>
                <div
                  className="wl-name"
                  style={r.n === "Unassigned" ? { color: COLORS.unassigned, fontStyle: "italic" } : undefined}
                >
                  {r.n}
                </div>
                <div className="wl-track">
                  <div className="wl-seg" style={{ width: `${(r["In Progress"] / max) * 100}%`, background: COLORS.progress }} />
                  <div className="wl-seg" style={{ width: `${(r.Unassigned / max) * 100}%`, background: COLORS.unassigned }} />
                </div>
                <div className="wl-ct tnum">{r.total}</div>
              </div>
            ))
          ) : (
            <div style={{ color: COLORS.inkSoft, fontSize: 13 }}>No open tasks.</div>
          )}
        </div>
      </div>
    </div>
  );
}
