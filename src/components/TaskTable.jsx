import { useEffect, useState } from "react";
import { PC } from "../lib/constants";
import { fmt, daysTo, taskCode } from "../lib/dates";
import { initials, avColor } from "../lib/format";

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the row set changes (filter/sort applied).
  useEffect(() => { setPage(1); }, [rows]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Build page number list: always show first, last, current ±1, with "…" gaps.
  function pageNumbers() {
    const nums = new Set([1, totalPages, safePage, safePage - 1, safePage + 1].filter(
      (n) => n >= 1 && n <= totalPages
    ));
    const sorted = [...nums].sort((a, b) => a - b);
    const result = [];
    sorted.forEach((n, i) => {
      if (i > 0 && n - sorted[i - 1] > 1) result.push("…");
      result.push(n);
    });
    return result;
  }

  const from = rows.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(safePage * PAGE_SIZE, rows.length);

  return (
    <>
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
          {slice.length ? (
            slice.map((t) => (
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

      {rows.length > 0 && (
        <div className="pagination noprint">
          <span className="pg-info">{from}–{to} of {rows.length} tasks</span>
          <div className="pg-controls">
            <button
              className="pg-btn"
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {pageNumbers().map((n, i) =>
              n === "…" ? (
                <span key={`gap-${i}`} className="pg-gap">…</span>
              ) : (
                <button
                  key={n}
                  className={`pg-btn${n === safePage ? " pg-active" : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              )
            )}
            <button
              className="pg-btn"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
