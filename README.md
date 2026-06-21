# FILEAM — Tax Filing Delivery Tracker (Vite + React)

A React port of the original single-file dashboard, using **SheetDB** (a Google
Sheet exposed as a REST API) as the backend — no server to run.

## Quick start

```bash
cd fileam-react
npm install
npm run dev        # opens http://localhost:5173
```

With no `.env`, the app runs on **localStorage** (seeded with sample tasks) so
you can try it immediately. To use a real Google Sheet, follow the setup below.

## Connect a Google Sheet via SheetDB

1. Create a Google Sheet. In the **first row**, add these column headers exactly:

   | id | name | owner | status | start | due |
   |----|------|-------|--------|-------|-----|

   - `status` should be one of: `Unassigned`, `In Progress`, `Completed`
   - `start` / `due` are dates in `YYYY-MM-DD` format
   - You can leave the data rows empty — the app can seed them for you.

2. Go to <https://sheetdb.io>, sign in, and **Create a new API** from your sheet
   (you'll connect it with the share link / Google auth).

3. Copy the API URL it gives you, e.g. `https://sheetdb.io/api/v1/abc123`.

4. In this folder, copy `.env.example` to `.env` and paste the URL:

   ```
   VITE_SHEETDB_URL=https://sheetdb.io/api/v1/abc123
   ```

5. Restart `npm run dev`. The app now reads/writes your sheet. If the sheet is
   empty, click **"Seed with sample tasks"** in the banner to populate it.

## Build for production

```bash
npm run build      # output in dist/
npm run preview    # preview the build locally
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages). Set `VITE_SHEETDB_URL` in the host's environment variables.

## Things to know about SheetDB (free tier)

- **Request cap:** the free plan limits API requests/month. Each page load is a
  read; each add/edit/delete is a write. Fine for a low-traffic internal tool.
- **The API URL is public** in the browser, so anyone using the app can read and
  write the sheet. Keep the sheet private/internal, or move to a plan with auth
  if you need access control.
- SheetDB returns all cells as strings; the data layer coerces `id` to a number.

## Swapping the backend later

All backend code lives in `src/api/sheetdb.js` and is consumed only through
`src/hooks/useTasks.js`. To switch to Supabase/Airtable/etc., implement the same
four functions (`getTasks`, `createTask`, `updateTask`, `deleteTask`) and the UI
stays untouched.

## Project layout

```
src/
├─ api/sheetdb.js      REST calls to SheetDB
├─ hooks/useTasks.js   load + CRUD + localStorage fallback
├─ lib/                dates, formatting, constants, CSV export
├─ components/         Kpis, Donut, Workload, FilterBar, TaskTable,
│                      TaskModal, WeeklyReport
├─ App.jsx             page shell, filters, sorting, modal wiring
└─ styles.css          original CSS, lifted as-is
```
