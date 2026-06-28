import { useMemo, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { counts as computeCounts } from "./lib/format";
import { daysTo, weekRef, thisWeekRange, weekRange } from "./lib/dates";
import { reportBuckets } from "./lib/report";
import { exportCSV } from "./lib/csv";

import Kpis from "./components/Kpis";
import Donut from "./components/Donut";
import Workload from "./components/Workload";
import FilterBar from "./components/FilterBar";
import TaskTable from "./components/TaskTable";
import TaskModal from "./components/TaskModal";
import WeeklyReport from "./components/WeeklyReport";

export default function App() {
  const { tasks, loading, error, remote, addTask, editTask, removeTask, seedSheet } = useTasks();

  const [view, setView] = useState("dash"); // "dash" | "report"
  const [seg, setSeg] = useState("all");
  const [owner, setOwner] = useState("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("due");
  const [sortDir, setSortDir] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dateRange, setDateRange] = useState(null); // null = All time

  // Use the same bucket logic as the weekly report so dashboard and report
  // stats are always consistent for the same date range.
  const visibleTasks = useMemo(() => {
    if (!dateRange) return tasks;
    const { from, to } = dateRange;
    const { carriedCompleted, stillOpen, startedThisPeriod } = reportBuckets(tasks, from, to);
    const seen = new Set([...carriedCompleted, ...stillOpen, ...startedThisPeriod].map((t) => t.id));
    const backlog = tasks.filter((t) => t.status === "Unassigned");
    return [
      ...tasks.filter((t) => seen.has(t.id)),
      ...backlog.filter((t) => !seen.has(t.id)),
    ];
  }, [tasks, dateRange]);

  const counts = useMemo(() => computeCounts(visibleTasks, daysTo), [visibleTasks]);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    const r = visibleTasks.filter(
      (t) =>
        (seg === "all" || t.status === seg) &&
        (owner === "all" || (owner === "__un" ? !t.owner : t.owner === owner)) &&
        (!q || t.name.toLowerCase().includes(q) || (t.owner || "").toLowerCase().includes(q))
    );
    r.sort((a, b) => {
      let x = a[sortKey] || "";
      let y = b[sortKey] || "";
      if (sortKey === "owner") {
        x = x || "~~~";
        y = y || "~~~";
      }
      return x < y ? -1 * sortDir : x > y ? 1 * sortDir : 0;
    });
    return r;
  }, [visibleTasks, seg, owner, query, sortKey, sortDir]);

  function onSort(k) {
    if (sortKey === k) setSortDir((d) => d * -1);
    else {
      setSortKey(k);
      setSortDir(1);
    }
  }

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }
  function openEdit(id) {
    setEditingId(id);
    setModalOpen(true);
  }
  function handleSave(data) {
    if (editingId) editTask(editingId, data);
    else addTask(data);
    setModalOpen(false);
  }
  function handleDelete(id) {
    if (confirm("Delete this task?")) {
      removeTask(id);
      setModalOpen(false);
    }
  }

  const editingTask = editingId ? tasks.find((t) => t.id === editingId) : null;

  return (
    <div className="wrap">
      {view === "dash" ? (
        <>
          <header className="bar">
            <div className="brand">
              <div className="mark">F</div>
              <div>
                <h1>FILEAM</h1>
                <div className="sub">Tax Filing Platform · Delivery Tracker</div>
              </div>
            </div>
            <div className="head-right">
              <div className="ref">
                Report ref <b>{weekRef()}</b>
              </div>
              <button className="btn" onClick={() => exportCSV(visibleTasks)}>
                Export CSV
              </button>
              <button className="btn btn-accent" onClick={() => setView("report")}>
                Weekly report
              </button>
              <button className="btn btn-pri" onClick={openAdd}>
                + Add task
              </button>
            </div>
          </header>

          <div className="date-range-bar">
            <span className="date-range-label">Date range:</span>
            <div className="fld" style={{ margin: 0 }}>
              <label style={{ fontSize: 11 }}>From</label>
              <input
                type="date"
                value={dateRange?.from ?? ""}
                max={dateRange?.to ?? ""}
                disabled={!dateRange}
                onChange={(e) => setDateRange((r) => ({ ...r, from: e.target.value }))}
              />
            </div>
            <div className="fld" style={{ margin: 0 }}>
              <label style={{ fontSize: 11 }}>To</label>
              <input
                type="date"
                value={dateRange?.to ?? ""}
                min={dateRange?.from ?? ""}
                disabled={!dateRange}
                onChange={(e) => setDateRange((r) => ({ ...r, to: e.target.value }))}
              />
            </div>
            <button
              className={`btn${!dateRange ? " btn-active" : ""}`}
              onClick={() => setDateRange(null)}
            >
              All time
            </button>
            <button
              className={`btn${dateRange && dateRange.from === weekRange(-1).from ? " btn-active" : ""}`}
              onClick={() => setDateRange(weekRange(-1))}
            >
              Last week
            </button>
            <button
              className={`btn${dateRange && dateRange.from === thisWeekRange().from ? " btn-active" : ""}`}
              onClick={() => setDateRange(thisWeekRange())}
            >
              This week
            </button>
          </div>

          {error && (
            <div className="banner banner-err">
              Backend error: {error} — showing local data. Check VITE_SHEETDB_URL and your sheet columns.
            </div>
          )}
          {!remote && !loading && (
            <div className="banner banner-warn">
              No SheetDB URL set — running on local browser storage. Add{" "}
              <b>VITE_SHEETDB_URL</b> to <b>.env</b> to use your Google Sheet.
            </div>
          )}
          {remote && !loading && !error && tasks.length === 0 && (
            <div className="banner banner-info">
              Your sheet is empty.{" "}
              <button className="btn" style={{ padding: "2px 8px" }} onClick={seedSheet}>
                Seed with sample tasks
              </button>
            </div>
          )}

          {loading ? (
            <div className="banner banner-info">Loading tasks…</div>
          ) : (
            <>
              <Kpis tasks={visibleTasks} counts={counts} totalTasks={dateRange ? tasks.length : null} />
              <div className="grid">
                <Donut tasks={visibleTasks} counts={counts} />
                <Workload tasks={visibleTasks} />
              </div>
              <div className="tablewrap">
                <FilterBar
                  tasks={visibleTasks}
                  seg={seg}
                  setSeg={setSeg}
                  owner={owner}
                  setOwner={setOwner}
                  query={query}
                  setQuery={setQuery}
                />
                <TaskTable rows={rows} sortKey={sortKey} sortDir={sortDir} onSort={onSort} onEdit={openEdit} />
              </div>
            </>
          )}
        </>
      ) : (
        <WeeklyReport tasks={tasks} onBack={() => setView("dash")} />
      )}

      <TaskModal
        open={modalOpen}
        task={editingTask}
        allTasks={tasks}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
