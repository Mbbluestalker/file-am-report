import { useEffect, useMemo, useState } from "react";
import { STATUSES, COLORS } from "../lib/constants";
import { todayStr } from "../lib/dates";

const blank = { name: "", owner: "", status: "Unassigned", start: "", due: "", completed: "" };

export default function TaskModal({ open, task, allTasks, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(blank);
  const isEdit = Boolean(task);

  useEffect(() => {
    if (open) setForm(task ? { ...task } : blank);
  }, [open, task]);

  const owners = useMemo(
    () => [...new Set(allTasks.map((t) => t.owner).filter(Boolean))].sort(),
    [allTasks]
  );

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function save() {
    const name = form.name.trim();
    if (!name) return;
    const owner = form.owner.trim();
    let status = form.status;
    if (owner && status === "Unassigned") status = "In Progress"; // owner implies work started
    // `completed` tracks WHEN a task was finished — needed for date-range reports.
    // Stamp today when marking done (keeping any date the user set), clear it otherwise.
    const completed = status === "Completed" ? form.completed || todayStr() : "";
    onSave({ name, owner, status, start: form.start, due: form.due, completed });
  }

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-h">
          <h3>{isEdit ? "Edit task" : "Add task"}</h3>
          <button className="x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-b">
          <div className="fld">
            <label>Task name</label>
            <input type="text" placeholder="e.g. TIN validation service" value={form.name} onChange={set("name")} autoFocus />
          </div>
          <div className="two">
            <div className="fld">
              <label>Owner</label>
              <input type="text" list="ownerList" placeholder="Leave blank = unassigned" value={form.owner} onChange={set("owner")} />
              <datalist id="ownerList">
                {owners.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </div>
            <div className="fld">
              <label>Status</label>
              <select value={form.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="two">
            <div className="fld">
              <label>Start date</label>
              <input type="date" value={form.start} onChange={set("start")} />
            </div>
            <div className="fld">
              <label>Due date</label>
              <input type="date" value={form.due} onChange={set("due")} />
            </div>
          </div>
          {form.status === "Completed" && (
            <div className="fld">
              <label>Completed date</label>
              <input type="date" value={form.completed || ""} onChange={set("completed")} />
            </div>
          )}
        </div>
        <div className="modal-f">
          {isEdit && (
            <button className="btn" style={{ color: COLORS.overdue }} onClick={() => onDelete(task.id)}>
              Delete
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-pri" onClick={save}>
              Save task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
