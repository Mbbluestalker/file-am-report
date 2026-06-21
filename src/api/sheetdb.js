// ---------------------------------------------------------------------------
// SheetDB data layer.
//
// SheetDB (https://sheetdb.io) turns a Google Sheet into a REST API, so the
// Google Sheet IS the database. Set VITE_SHEETDB_URL in .env to your endpoint,
// e.g. https://sheetdb.io/api/v1/abcd1234
//
// The Google Sheet's first row (header) MUST have these columns, exactly:
//   id | name | owner | status | start | due
//
// If VITE_SHEETDB_URL is not set, the app automatically falls back to
// localStorage so you can develop/demo without a backend (see useTasks.js).
//
// Note: SheetDB returns every cell as a string, so we coerce `id` to a number.
// ---------------------------------------------------------------------------

const URL = import.meta.env.VITE_SHEETDB_URL || "";

export const isConfigured = () => Boolean(URL);

function normalize(row) {
  return {
    id: Number(row.id),
    name: row.name || "",
    owner: row.owner || "",
    status: row.status || "Unassigned",
    start: row.start || "",
    due: row.due || "",
  };
}

async function req(path, options) {
  const res = await fetch(URL + path, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SheetDB ${res.status}: ${body || res.statusText}`);
  }
  return res.json().catch(() => ({}));
}

export async function getTasks() {
  const rows = await req("", { method: "GET" });
  return (Array.isArray(rows) ? rows : []).map(normalize).filter((t) => !Number.isNaN(t.id));
}

export async function createTask(task) {
  // SheetDB accepts { data: [ {...} ] }
  await req("", { method: "POST", body: JSON.stringify({ data: [task] }) });
  return task;
}

export async function updateTask(task) {
  // PATCH rows where column id === task.id
  await req(`/id/${task.id}`, { method: "PATCH", body: JSON.stringify({ data: task }) });
  return task;
}

export async function deleteTask(id) {
  await req(`/id/${id}`, { method: "DELETE" });
  return id;
}

// Push the seed rows into an empty sheet (used by "Seed sheet" action).
export async function bulkCreate(tasks) {
  await req("", { method: "POST", body: JSON.stringify({ data: tasks }) });
  return tasks;
}
