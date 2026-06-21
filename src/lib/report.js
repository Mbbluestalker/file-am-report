// ---------------------------------------------------------------------------
// Date-range ("period") reporting.
//
// A task's `status` is only its CURRENT value, so on its own it can't tell us
// what state a task was in last week. To answer "was this open last week and
// completed this week?" we reconstruct state from its `start` and `completed`
// dates (ISO "YYYY-MM-DD", so lexical compare == date compare).
//
// Weeks run Monday→Friday, and each week's report is sent the FOLLOWING TUESDAY
// — so a task finished on a week's Monday OR Tuesday is credited to the PREVIOUS
// week (that report hasn't gone out yet). Concretely, a period [from, to] counts
// completions in the window (cutoff, close], where:
//   - cutoff = the Tuesday of this week     → completions on/before it = previous week
//   - close  = the Tuesday after `to`       → completions through it   = this week
// This keeps consecutive weekly reports gap-free.
// ---------------------------------------------------------------------------

import { nextWeekday } from "./dates";

const REPORT_DOW = 2; // Tuesday — the day a finished week's report is sent

export const startedBefore = (t, d) => Boolean(t.start && t.start < d);
export const completedBy = (t, d) => Boolean(t.completed && t.completed <= d);
export const startedInRange = (t, from, to) =>
  Boolean(t.start && t.start >= from && t.start <= to);

export function reportBuckets(tasks, from, to) {
  const cutoff = nextWeekday(from, REPORT_DOW); // this week's report day
  const close = nextWeekday(to, REPORT_DOW); // next week's report day (closes this period)

  // Carried INTO this period: started before it began (Mon) and not yet
  // completed as of its report day (Tue). A task that started this week, or was
  // finished on/before this Tuesday, is not a carry-over.
  const carried = (t) => startedBefore(t, from) && !completedBy(t, cutoff);
  const completedThisPeriod = (t) =>
    Boolean(t.completed && t.completed > cutoff && t.completed <= close);

  return {
    // Open before this week AND finished during it (carry-over → done).
    carriedCompleted: tasks.filter((t) => carried(t) && completedThisPeriod(t)),
    // Open before this week AND still not done by its report day.
    stillOpen: tasks.filter((t) => carried(t) && !completedBy(t, close)),
    // Work that began inside this period (new this week).
    startedThisPeriod: tasks.filter((t) => startedInRange(t, from, to)),
  };
}
