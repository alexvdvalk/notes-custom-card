# Notes Custom Card

A compact SvelteKit app that displays Bullhorn **Note** records for a candidate. It is designed to be embedded in Bullhorn as a **custom card** or **custom tab** on the Candidate record, loaded inside an iframe and communicating with Bullhorn via [`@bullhorn/connect`](https://github.com/bullhorn/connect) `AppBridge`.

Each note is shown as a small card with:

- **Author** — `commentingPerson` (first and last name)
- **Added** — relative date (`formatDistance`, e.g. “3 days ago”) with full timestamp on hover
- **Action** — HTML from Bullhorn’s `action` field
- **Comments** — note body when present (HTML)

---

## Bullhorn embedding

Host the production build (`build/`) on HTTPS and register the URL in Bullhorn as a custom card or tab on the **Candidate** entity.

**Recommended URL pattern:**

```
https://<your-host>/notes?EntityID={id}&filter=<actions>
```

Bullhorn passes the current record ID as `EntityID` when the iframe loads. You can create multiple custom cards/tabs pointing at the same app with different `filter` values to show different note types in each panel.

| Parameter   | Required | Description |
|------------|----------|-------------|
| `EntityID` | Yes      | Bullhorn candidate ID for the open record. Notes are queried with `candidateUserID:{EntityID}`. |
| `filter`   | No       | Comma-separated list of note **action** values. When omitted, all non-deleted notes for the candidate are returned. |

### Example URLs

```text
# All notes for the candidate
https://<your-host>/notes?EntityID={id}

# Only placement-related notes
https://<your-host>/notes?EntityID={id}&filter=placement

# Multiple action types (OR logic)
https://<your-host>/notes?EntityID={id}&filter=email,sms,outbound call
```

### Expected filters

The `filter` query parameter maps to Bullhorn’s Note **`action`** field. Each value is trimmed, lowercased, and combined with **OR** logic in the search query:

```text
isDeleted:false AND candidateUserID:{EntityID} AND action:('value1' OR 'value2')
```

Filter values must match the **action text stored on the note** in your Bullhorn corp (matching is case-insensitive). Typical Bullhorn note actions you may filter on include:

| Filter value (example) | Typical use |
|------------------------|-------------|
| `note`                 | General notes |
| `email`                | Email activity |
| `sms`                  | SMS / text messages |
| `outbound call`        | Outbound calls |
| `inbound call`         | Inbound calls |
| `meeting`              | Meetings |
| `task`                 | Tasks |
| `placement`            | Placement-related notes |
| `interview`            | Interview notes |

> **Important:** Action labels can vary by corp configuration and locale. Confirm exact strings in your environment (e.g. from an existing note’s Action column or Bullhorn admin settings) before wiring up custom tabs.

**Suggested custom tab setup:**

| Tab name        | `filter` value |
|-----------------|----------------|
| All notes       | *(omit `filter`)* |
| Communications  | `email,sms,outbound call,inbound call` |
| Placements      | `placement` |
| Interviews      | `interview` |

---

## Development

Requires [Bun](https://bun.sh) (or npm).

```bash
bun install
bun run dev
```

The app must run **inside Bullhorn** (or a Bullhorn dev harness) for `AppBridge` API calls to work. Opening `/notes` directly in a browser without Bullhorn will show an empty list because `EntityID` and `postRobot` are not available.

For local UI work, open:

```text
http://localhost:5173/notes?EntityID=<candidateId>&filter=note
```

inside a Bullhorn session or use Bullhorn’s `DevAppBridge` if you have a local test setup.

---

## Build & deploy

```bash
bun run build
```

Output is written to `build/` as a static SPA (`adapter-static` with `fallback: 'index.html'`). Deploy the entire `build` directory to any static host (S3, Azure Blob, nginx, etc.).

The build uses `bundleStrategy: "inline"` so CSS and JS are embedded into `index.html` — useful when Bullhorn expects a single HTML entry point for a custom card.

```bash
bun run preview   # preview production build locally
```

---

## Architecture

```text
Bullhorn Candidate record (iframe)
  └── /notes?EntityID=…&filter=…
        └── +page.ts          → reads query params, loads notes in browser
        └── lib/bullhorn.ts   → AppBridge.httpGET → search/Note
        └── NoteCard.svelte   → compact card UI per note
```

- **API:** Bullhorn REST search via `AppBridge.httpGET('search/Note?query=…&fields=…')`
- **Query:** `isDeleted:false AND candidateUserID:{id}` plus optional `action:(…)` filter
- **Client-only:** `AppBridge` is loaded dynamically in the browser only (not during SSR/build)

---

## Scripts

| Command           | Description |
|-------------------|-------------|
| `bun run dev`     | Start dev server |
| `bun run build`   | Production build to `build/` |
| `bun run preview` | Preview production build |
| `bun run check`   | Typecheck with `svelte-check` |
| `bun run lint`    | Prettier check |
| `bun run format`  | Format with Prettier |

---

## Tech stack

- [SvelteKit](https://kit.svelte.dev) + Svelte 5
- [Tailwind CSS](https://tailwindcss.com) v4 + [shadcn-svelte](https://shadcn-svelte.com)
- [date-fns](https://date-fns.org) — relative dates
- [@lucide/svelte](https://lucide.dev) — field icons
- [@bullhorn/connect](https://github.com/bullhorn/connect) — iframe bridge to Bullhorn REST API
