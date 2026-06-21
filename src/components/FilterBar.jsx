import { useMemo } from "react";

const SEGMENTS = ["all", "Unassigned", "In Progress", "Completed"];
const SEG_LABEL = { all: "All", Unassigned: "Unassigned", "In Progress": "In Progress", Completed: "Completed" };

export default function FilterBar({ tasks, seg, setSeg, owner, setOwner, query, setQuery }) {
  const owners = useMemo(
    () => [...new Set(tasks.map((t) => t.owner).filter(Boolean))].sort(),
    [tasks]
  );

  return (
    <div className="filters">
      <div className="seg">
        {SEGMENTS.map((s) => (
          <button key={s} className={seg === s ? "on" : ""} onClick={() => setSeg(s)}>
            {SEG_LABEL[s]}
          </button>
        ))}
      </div>
      <select value={owner} onChange={(e) => setOwner(e.target.value)}>
        <option value="all">All owners</option>
        <option value="__un">Unassigned</option>
        {owners.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search tasks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
