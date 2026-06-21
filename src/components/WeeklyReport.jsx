import { STATUSES, STATUS_COLOR, COLORS } from "../lib/constants";
import { fmt, daysTo, weekRef, taskCode, today } from "../lib/dates";

export default function WeeklyReport({ tasks, counts, onBack }) {
  const dateLong = today().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="noprint" style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <button className="btn" onClick={onBack}>
          ← Back to dashboard
        </button>
        <button className="btn btn-pri" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>

      <div className="rep-head">
        <div>
          <div className="rep-title">Weekly Status Report</div>
          <div style={{ color: COLORS.inkSoft, fontSize: 13, marginTop: 3 }}>
            FILEAM · Tax Filing Platform delivery
          </div>
        </div>
        <div className="meta">
          Ref <b style={{ color: COLORS.ink }}>{weekRef()}</b>
          <br />
          {dateLong}
          <br />
          Prepared by: Project Manager
        </div>
      </div>

      <div className="rep-sum">
        <div>
          <span className="tnum">{tasks.length}</span>
          <small>Total tasks</small>
        </div>
        <div>
          <span className="tnum" style={{ color: COLORS.unassigned }}>{counts.Unassigned}</span>
          <small>Unassigned</small>
        </div>
        <div>
          <span className="tnum" style={{ color: COLORS.progress }}>{counts["In Progress"]}</span>
          <small>In progress</small>
        </div>
        <div>
          <span className="tnum" style={{ color: COLORS.complete }}>{counts.Completed}</span>
          <small>Completed</small>
        </div>
        <div>
          <span className="tnum" style={{ color: COLORS.overdue }}>{counts.overdue}</span>
          <small>Overdue</small>
        </div>
      </div>

      {STATUSES.map((s) => {
        const list = tasks
          .filter((t) => t.status === s)
          .sort((a, b) => ((a.due || "") < (b.due || "") ? -1 : 1));
        return (
          <div className="rep-sec" key={s}>
            <h4>
              <span className="pd" style={{ background: STATUS_COLOR[s] }} />
              {s}
              <span className="cnt">
                {list.length} task{list.length !== 1 ? "s" : ""}
              </span>
            </h4>
            {!list.length ? (
              <div style={{ color: COLORS.inkSoft, fontSize: 13 }}>None this week.</div>
            ) : (
              <table className="rep">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Owner</th>
                    <th>Start</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((t) => {
                    const d = daysTo(t.due);
                    const over = s !== "Completed" && d !== null && d < 0;
                    return (
                      <tr key={t.id} className={over ? "over" : ""}>
                        <td>
                          <b>{t.name}</b> <span className="tk-id">{taskCode(t.id)}</span>
                        </td>
                        <td>
                          {t.owner || <i style={{ color: COLORS.unassigned }}>Unassigned</i>}
                        </td>
                        <td className="tnum">{fmt(t.start)}</td>
                        <td className="tnum">
                          {fmt(t.due)}
                          {over && <b style={{ color: COLORS.overdue }}> ({-d}d late)</b>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
