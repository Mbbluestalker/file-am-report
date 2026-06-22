import { useMemo, useState } from "react";
import { COLORS, STATUSES, STATUS_COLOR } from "../lib/constants";
import { fmt, daysTo, weekRef, taskCode, today, thisWeekRange, weekRange } from "../lib/dates";
import { reportBuckets } from "../lib/report";
import Kpis from "./Kpis";
import Donut from "./Donut";
import Workload from "./Workload";

// One reusable section + table for a bucket of tasks.
function Section({ color, title, hint, list, columns }) {
  return (
    <div className="rep-sec">
      <h4>
        <span className="pd" style={{ background: color }} />
        {title}
        <span className="cnt">
          {list.length} task{list.length !== 1 ? "s" : ""}
        </span>
      </h4>
      {hint && (
        <div style={{ color: COLORS.inkSoft, fontSize: 12, margin: "-4px 0 8px" }}>{hint}</div>
      )}
      {!list.length ? (
        <div style={{ color: COLORS.inkSoft, fontSize: 13 }}>None in this period.</div>
      ) : (
        <table className="rep">
          <thead>
            <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id} className={t.__over ? "over" : ""}>
                {columns.map((c) => (
                  <td key={c.key} className={c.num ? "tnum" : undefined}>
                    {c.render(t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const nameCell = (t) => (
  <>
    <b>{t.name}</b> <span className="tk-id">{taskCode(t.id)}</span>
  </>
);
const ownerCell = (t) =>
  t.owner || <i style={{ color: COLORS.unassigned }}>Unassigned</i>;

export default function WeeklyReport({ tasks, counts, onBack }) {
  const [range, setRange] = useState(() => thisWeekRange());
  const { from, to } = range;

  const dateLong = today().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const rangeLabel = `${fmt(from)} – ${fmt(to)}`;

  const { carriedCompleted, stillOpen, startedThisPeriod } = useMemo(
    () => reportBuckets(tasks, from, to),
    [tasks, from, to]
  );

  // Mark overdue open tasks (due before today and not completed) for row styling.
  const flagOverdue = (t) => {
    const d = daysTo(t.due);
    return { ...t, __over: d !== null && d < 0 };
  };
  const stillOpenRows = stillOpen.map(flagOverdue);

  const dueCol = {
    key: "due",
    label: "Due",
    num: true,
    render: (t) => {
      const d = daysTo(t.due);
      const over = t.__over;
      return (
        <>
          {fmt(t.due)}
          {over && <b style={{ color: COLORS.overdue }}> ({-d}d late)</b>}
        </>
      );
    },
  };

  return (
    <div>
      <div className="noprint" style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <button className="btn" onClick={onBack}>
          ← Back to dashboard
        </button>
        <div className="fld" style={{ margin: 0 }}>
          <label style={{ fontSize: 11 }}>From</label>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
          />
        </div>
        <div className="fld" style={{ margin: 0 }}>
          <label style={{ fontSize: 11 }}>To</label>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
          />
        </div>
        <button className="btn" onClick={() => setRange(weekRange(-1))}>
          Last week
        </button>
        <button className="btn" onClick={() => setRange(thisWeekRange())}>
          This week
        </button>
        <button
          className="btn btn-pri"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            const prev = document.title;
            document.title = `FILEAM — Report ${from} to ${to}`;
            window.print();
            document.title = prev;
          }}
        >
          Print / Save PDF
        </button>
      </div>

      <div className="rep-head">
        <div>
          <div className="rep-title">Status Report</div>
          <div style={{ color: COLORS.inkSoft, fontSize: 13, marginTop: 3 }}>
            FILEAM — Delivery Tracker
          </div>
          <div style={{ color: COLORS.ink, fontSize: 13, marginTop: 6 }}>
            Period: <b>{rangeLabel}</b>
          </div>
        </div>
        <div className="meta">
          Ref <b style={{ color: COLORS.ink }}>{weekRef()}</b>
          <br />
          {dateLong}
          <br />
          Prepared by: <b style={{ color: COLORS.ink }}>Jennifer Ottis</b>
        </div>
      </div>

      <Kpis tasks={tasks} counts={counts} />
      <div className="grid">
        <Donut tasks={tasks} counts={counts} />
        <Workload tasks={tasks} />
      </div>

      <Section
        color={COLORS.complete}
        title="Carried over → completed this period"
        hint="Open before this week and finished during it (completions on/before Tuesday count for the previous week)."
        list={carriedCompleted}
        columns={[
          { key: "name", label: "Task", render: nameCell },
          { key: "owner", label: "Owner", render: ownerCell },
          { key: "start", label: "Start", num: true, render: (t) => fmt(t.start) },
          { key: "completed", label: "Completed", num: true, render: (t) => fmt(t.completed) },
        ]}
      />

      <Section
        color={COLORS.progress}
        title="Carried over → still open"
        hint="Open before this week and still not completed by its reporting day."
        list={stillOpenRows}
        columns={[
          { key: "name", label: "Task", render: nameCell },
          { key: "owner", label: "Owner", render: ownerCell },
          { key: "start", label: "Start", num: true, render: (t) => fmt(t.start) },
          dueCol,
        ]}
      />

      {(() => {
        const startedCols = [
          { key: "name", label: "Task", render: nameCell },
          { key: "owner", label: "Owner", render: ownerCell },
          { key: "start", label: "Start", num: true, render: (t) => fmt(t.start) },
          { key: "due", label: "Due", num: true, render: (t) => fmt(t.due) },
        ];
        const groups = STATUSES.map((s) => ({
          s,
          list: startedThisPeriod.filter((t) => t.status === s),
        })).filter((g) => g.list.length);

        if (!groups.length) {
          return (
            <Section
              color={COLORS.unassigned}
              title="Started this period"
              hint="Work that began within the selected dates, grouped by status."
              list={[]}
              columns={startedCols}
            />
          );
        }
        return groups.map((g) => (
          <Section
            key={g.s}
            color={STATUS_COLOR[g.s]}
            title={`Started this period · ${g.s}`}
            list={g.list}
            columns={startedCols}
          />
        ));
      })()}
    </div>
  );
}
