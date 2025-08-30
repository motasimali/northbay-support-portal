# Social Support Portal — Architecture

## Tech Stack
- **React + Vite + Tailwind**
- **React Router** (step routing + guards)
- **React Hook Form** (per-step form state)
- **Zod** (validation schemas)
- **i18next** (EN/AR)
- **Axios** (HTTP)
- **LocalStorage** (`ssp.form`) for persistence
- **Error Boundary** (app shell safety)

## App Flow
1. **Step 1 – Personal** → **Step 2 – Family & Financial** → **Step 3 – Situation** → **Review** → **Success**
2. Navigation is the stepper + Back/Next buttons.
3. **RequireStep** guard prevents jumping ahead until previous steps are complete.

## State & Persistence
- **FormContext** holds the canonical in-app form object:
  ```ts
  {
    personal: { ... },
    family:   { ... },
    situation:{ ... }
  }
  ```
- **Autosave**: each step debounces (~400ms) and writes only **valid, non-empty fields** into context → localStorage (`ssp.form`).
- **Rehydrate**: on mount (and “resumed” flag) each step calls `reset(defaultValues)` with data from context/localStorage.
- **Reset**:
  - Page-level reset is registered via `registerPageReset`.
  - Global **Reset** clears context + `ssp.form` and returns to Step 1.

## Validation
- **Zod** schemas per step.
- **Error messages store i18n keys**, not sentences (e.g., `"errors.nameRequired"`).
- `<Field />` translates the key at render time via `t(errorKey)`, so **changing language refreshes messages without revalidation**.
- Step 3 has a minimum length (≥20) per textarea and disables **Help Me Write** until that field is valid.

## Internationalization (EN/AR)
- Split files: `src/i18n/en.js`, `src/i18n/ar.js`.
- All labels, placeholders, options, banners, actions, success strings are localized.
- Errors are keys rendered by `<Field>`, so switching language updates them live.

## Accessibility
- `<Field>` automatically sets:
  - `aria-invalid` on the first control it wraps
  - `aria-describedby` linking hint/error text
- Keyboard-friendly buttons/links.
- The modal supports:
  - Escape-to-close
  - Initial focus inside the dialog
  - (Focus trapping intentionally simplified per project scope)

## HTTP & Error Handling
- **Two axios clients**:
  - `apiClient` → your backend (401 hook reserved for redirect)
  - `openaiClient` → OpenAI (separate base URL + API key header)
- **Hooks**:
  - `useApi` → generic REST calls for your API (loading/error/cancel/timeout)
  - `useOpenAI` → `generate({ notes, section, lang })` using `suggestText()`
- **Submission**:
  - Currently using `mockSubmit(payload)` to simulate backend latency & failures for UI testing.
  - Swap to a real `submitForm` (via `useApi` or a `useSubmitApplication` hook) when backend is ready.

## AI Integration (Step 3)
- **Help Me Write** modal:
  - Disables “Generate” until the active field has ≥20 chars.
  - Calls `useOpenAI.generate()` (axios, cancellable, timeout).
  - Shows suggestion in an editable textarea; **Accept** writes back to the form field.

## Routing & Guards
- `RequireStep` computes the first incomplete step and redirects to its route.
- Uses the latest of **context vs. localStorage** to decide progress (prevents regressions if one is fresher).

## Performance
- Route-level **lazy loading** of pages.
- Debounced autosave to minimize writes.

## Decisions (TL;DR)
- Store **error keys**, translate in `<Field>` → live language switch for errors.
- Keep **two axios clients** for safety (headers/interceptors differ).
- Debounce inside `useEffect` per step (simple, fresh closures).
- Modal’s focus handling kept intentionally minimal.

## Security Note
This demo shows front-end calls to OpenAI using a browser key. **In production**, proxy through your backend; never ship a private API key to the client. Once OpenAI call is moved to the backend. OpenAI axios client can be removed.
