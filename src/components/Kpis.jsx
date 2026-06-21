export default function Kpis({ tasks, counts }) {
  const total = tasks.length || 1;
  return (
    <section className="kpis">
      <div className="kpi">
        <div className="lab">Total tasks</div>
        <div className="num tnum">{tasks.length}</div>
        <div className="foot">across all workstreams</div>
      </div>
      <div className="kpi k-un">
        <div className="lab">Unassigned</div>
        <div className="num tnum">{counts.Unassigned}</div>
        <div className="foot">need an owner</div>
      </div>
      <div className="kpi k-prog">
        <div className="lab">In progress</div>
        <div className="num tnum">{counts["In Progress"]}</div>
        <div className="foot">active work</div>
      </div>
      <div className="kpi k-done">
        <div className="lab">Completed</div>
        <div className="num tnum">{counts.Completed}</div>
        <div className="foot">{Math.round((counts.Completed / total) * 100)}% of scope</div>
      </div>
      <div className="kpi k-over">
        <div className="lab">Overdue</div>
        <div className="num tnum">{counts.overdue}</div>
        <div className="foot">past due date</div>
      </div>
    </section>
  );
}
