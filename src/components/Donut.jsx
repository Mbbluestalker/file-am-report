import { STATUSES, STATUS_COLOR, COLORS } from "../lib/constants";

export default function Donut({ tasks, counts }) {
  const tot = tasks.length || 1;

  // build the dash segments (mirrors the original SVG donut math)
  const segs = [];
  let off = 25;
  STATUSES.forEach((s) => {
    const pct = (counts[s] / tot) * 100;
    if (pct <= 0) return;
    segs.push({ s, pct, off });
    off = (off - pct + 100) % 100;
  });

  return (
    <div className="panel">
      <div className="panel-h">
        <h2>Status breakdown</h2>
        <span className="tk-id">{tasks.length} tasks</span>
      </div>
      <div className="panel-b">
        <div className="donut-row">
          <svg width="150" height="150" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.9155" fill="none" stroke={COLORS.track} strokeWidth="6" />
            {segs.map(({ s, pct, off }) => (
              <circle
                key={s}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                stroke={STATUS_COLOR[s]}
                strokeWidth="6"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={off}
              />
            ))}
            <text x="21" y="20.5" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Space Grotesk" fill={COLORS.ink}>
              {tasks.length}
            </text>
            <text x="21" y="25.5" textAnchor="middle" fontSize="2.6" fill={COLORS.inkSoft}>
              TASKS
            </text>
          </svg>
          <div className="legend">
            {STATUSES.map((s) => (
              <div className="leg" key={s}>
                <span className="dot" style={{ background: STATUS_COLOR[s] }} />
                {s}
                <span className="lv tnum">{counts[s]}</span>
                <span className="lp tnum">{Math.round((counts[s] / tot) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
