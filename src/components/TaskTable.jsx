import { PC } from "../lib/constants";
import { fmt, daysTo, taskCode } from "../lib/dates";
import { initials, avColor } from "../lib/format";

const COLUMNS = [
  { k: "name", label: "Task" },
  { k: "owner", label: "Owner" },
  { k: "status", label: "Status" },
  { k: "start", label: "Start", hide: true },
  { k: "due", label: "Due" },
];

function OwnerCell({ owner }) {
  if (!owner)
    return (
      <div className="owner none">
        <span className="av">?</span>
        <span>Unassigned</span>
      </div>
    );
  return (
    <div className="owner">
      <span className="av" style={{ background: avColor(owner) }}>
        {initials(owner)}
      </span>
      <span>{owner}</span>
    </div>
  );
}

function DueChip({ task }) {
  if (task.status === "Completed") return null;
  const d = daysTo(task.due);
  if (d === null) return null;
  if (d < 0) return <span className="due-chip due-over">{-d}d overdue</span>;
  if (d <= 7) return <span className="due-chip due-soon">in {d}d</span>;
  return <span className="due-chip due-ok">in {d}d</span>;
}

export default function TaskTable({ rows, sortKey, sortDir, onSort, onEdit }) {
  return (
    <table>
      <thead>
        <tr>
          {COLUMNS.map((c) => (
            <th key={c.k} className={c.hide ? "hide" : undefined} onClick={() => onSort(c.k)}>
              {c.label} <span className="ar">↕</span>
            </th>
          ))}
          <th className="noprint" />
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((t) => (
            <tr key={t.id}>
              <td>
                <div className="tk-name">{t.name}</div>
                <div className="tk-id">{taskCode(t.id)}</div>
              </td>
              <td>
                <OwnerCell owner={t.owner} />
              </td>
              <td>
                <span className={`pill ${PC[t.status]}`}>
                  <span className="pd" />
                  {t.status}
                </span>
              </td>
              <td className="hide">
                <span className="date">{fmt(t.start)}</span>
              </td>
              <td>
                <span className="date">{fmt(t.due)}</span>
                <DueChip task={t} />
              </td>
              <td className="noprint">
                <div className="rowact">
                  <button className="ic" onClick={() => onEdit(t.id)}>
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6}>
              <div className="empty">
                <b>No tasks match</b>Try clearing filters or add a new task.
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
