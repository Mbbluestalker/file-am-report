import { useCallback, useEffect, useState } from "react";
import * as sheet from "../api/sheetdb";
import { SEED } from "../lib/constants";

const LS_KEY = "fileam_tasks";

// localStorage fallback (used when VITE_SHEETDB_URL is not set)
const ls = {
  read() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : null;
      return Array.isArray(arr) && arr.length ? arr : SEED.slice();
    } catch {
      return SEED.slice();
    }
  },
  write(tasks) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tasks));
    } catch {
      /* ignore quota errors */
    }
  },
};

const nextId = (tasks) => Math.max(0, ...tasks.map((t) => t.id)) + 1;

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const remote = sheet.isConfigured();

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (remote) {
        setTasks(await sheet.getTasks());
      } else {
        setTasks(ls.read());
      }
    } catch (e) {
      setError(e.message || String(e));
      setTasks(ls.read()); // graceful degrade so the UI still works
    } finally {
      setLoading(false);
    }
  }, [remote]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = useCallback(
    async (data) => {
      const task = { ...data, id: nextId(tasks) };
      setTasks((prev) => [...prev, task]); // optimistic
      try {
        if (remote) await sheet.createTask(task);
        else ls.write([...tasks, task]);
      } catch (e) {
        setError(e.message || String(e));
        await reload();
      }
      return task;
    },
    [tasks, remote, reload]
  );

  const editTask = useCallback(
    async (id, data) => {
      const updated = { ...data, id };
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t))); // optimistic
      try {
        if (remote) await sheet.updateTask(updated);
        else ls.write(tasks.map((t) => (t.id === id ? updated : t)));
      } catch (e) {
        setError(e.message || String(e));
        await reload();
      }
      return updated;
    },
    [tasks, remote, reload]
  );

  const removeTask = useCallback(
    async (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id)); // optimistic
      try {
        if (remote) await sheet.deleteTask(id);
        else ls.write(tasks.filter((t) => t.id !== id));
      } catch (e) {
        setError(e.message || String(e));
        await reload();
      }
    },
    [tasks, remote, reload]
  );

  const seedSheet = useCallback(async () => {
    setError(null);
    try {
      if (remote) {
        await sheet.bulkCreate(SEED);
        await reload();
      } else {
        ls.write(SEED.slice());
        setTasks(SEED.slice());
      }
    } catch (e) {
      setError(e.message || String(e));
    }
  }, [remote, reload]);

  return { tasks, loading, error, remote, reload, addTask, editTask, removeTask, seedSheet };
}
