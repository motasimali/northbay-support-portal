# Social Support Portal (React + Vite + Tailwind)

A small, accessible, multi-step form built with React, Vite, Tailwind, React Router, **React Hook Form**, and **Zod**.  
It saves progress to localStorage, supports English/Arabic, and includes an AI **Help me write** assistant powered by OpenAI Chat Completions.

---

## ✨ Features

- **Three-step wizard** + Review + Success  
  1) Personal Info  
  2) Family & Financial  
  3) Situation (3 textareas with AI assist)
- **Validation**: Zod schemas per step (Step 1, 2, 3)  
  - Error messages store **i18n keys** and are translated in `<Field>` at render time → switching EN/AR updates messages **without revalidation**
- **Persistence**: auto-saves to `localStorage` under **`ssp.form`**  
  - Debounced **save-on-typing** (only merges valid, non-empty fields)  
  - Also saves on Next/Review submit
- **Guarded navigation**: can’t jump to later steps until previous ones are valid (`RequireStep`)
- **Reset flow**: clears inputs + localStorage and returns to Step 1
- **Internationalization**: English / Arabic with automatic LTR/RTL; files split (`en.js`, `ar.js`)
- **Accessibility**: labeled fields, `aria-describedby`, live error announcements, accessible modal (escape + focus-on-open), keyboard support
- **AI integration**: “Help me write” uses **gpt-3.5-turbo** with neutral, first‑person output; button is disabled until the target textarea content is valid (≥ 20 chars)
- **Error Boundary**: app-level error capture and fallback UI
- **Lazy-loaded routes** to keep startup fast
- **Reusable controls**: `TextInput`, `SelectInput`, `TextArea` (asterisk shown for `required`)

---

## 🧰 Tech Stack

- React + Vite + Tailwind CSS  
- React Router (v6)  
- React Hook Form + **Zod** (`@hookform/resolvers/zod`)  
- i18next (`react-i18next`)  
- Axios (two clients: **apiClient** and **openaiClient**)
- Jest + React Testing Library (basic tests)

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+** and npm

### Install & Run (Dev)
```bash
npm install
npm run dev
```
Open: http://localhost:5173

### Build & Preview (Prod)
```bash
npm run build
npm run preview
```

---

## 🔑 How to set up the OpenAI API Key

> The **Help me write** button on Step 3 calls the OpenAI Chat Completions API.  
> For this assignment, we call OpenAI **from the browser** (simple, not for production).

1. Create an OpenAI API key and copy it (`sk-…`).
2. Create **`.env.local`** in the project root:

```bash
# .env.local
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

> Vite exposes only variables prefixed with `VITE_`.

3. Restart dev server:
```bash
npm run dev
```

**Troubleshooting**
- **401 Unauthorized** → bad/missing key; check `.env.local` and restart
- **429 Rate limit** → too many requests; wait and retry
- **Model not found** → ensure `VITE_OPENAI_MODEL=gpt-3.5-turbo`
- **Timeout/Network** → UI shows error; click **Retry**

**Production Note**  
Do **not** expose API keys client-side in real apps. Use a small server proxy and keep the key server-side.

---

## 🗂️ Project Structure (high level)

```text
src/
  components/
    Field.jsx
    HelpMeWrite.jsx
    LoadingButton.jsx
    Modal.jsx
    ProgressSteps.jsx
    controls/
      TextInput.jsx
      SelectInput.jsx
      TextArea.jsx
  hooks/
    useApi.js             # generic REST via apiClient (loading/error/timeout/cancel)
    useOpenAI.js          # generate() wrapper for OpenAI
    useFormContext.js     # Form provider + hook (app form state)
  i18n/
    index.js              # i18n init + dir switch
    en.js                 # English strings
    ar.js                 # Arabic strings
  layouts/
    RootLayout.jsx        # Header, language switch, stepper
  lib/
    apiClient.js          # axios for *your* API (+ mockSubmit for demo)
    openaiClient.js       # axios for OpenAI (separate baseURL & key)
    numberFormat.js
    stepCompletion.js     # helpers used by route guard
    storage.js            # load/save/clear localStorage "ssp.form"
  pages/
    Step1Personal.jsx
    Step2FamilyFinance.jsx
    Step3Situation.jsx
    Review.jsx
    Success.jsx
  routes/
    RequireStep.jsx       # Route guard: block access until prior steps valid
  validation/
    schemas.js            # Zod schemas; errors return i18n keys
  App.jsx
  main.jsx
  index.css
docs/
  Architecture.md
  API-and-AI.md
```

---

## 🧭 App Flow

- **Step 1 → Next** ⇒ save `personal`, go to Step 2  
- **Step 2 → Next** ⇒ save `family`, go to Step 3  
- **Step 3 → Review** ⇒ save `situation`, go to Review  
- **Submit** ⇒ on success, navigate to **/success** and hide the stepper/nav
- **Route Guard (`RequireStep`)**: prevents visiting Step 2/3/Review unless previous steps validate.  
  It checks both **context** and **localStorage** and uses whichever snapshot is **farther along** (works after refresh, no duplicate clicks).

**Progress bar**: On the Review page the stepper shows **100%** to indicate all steps completed.

---

## ✅ Validation

- **Zod** per step; resolver via `zodResolver(schema)`
- Error messages are **keys** (e.g., `errors.emailInvalid`) and translated in `<Field>`
- **Step 3**: each textarea requires ≥ 20 characters; “Help me write” is disabled until valid

**Examples**
- **Date of Birth**: strict `YYYY-MM-DD`, leap‑year aware, not in the future
- **Phone**: E.164ish (e.g., `+9715XXXXXXXX`)
- **Income/Dependents**: numeric parsing with RHF’s `valueAsNumber`

---

## ♿ Accessibility

- Semantic HTML, labeled inputs; `<Field>` wires `aria-invalid` and `aria-describedby`
- Errors announced with `role="alert"`
- Modal: `role="dialog"`, `aria-modal="true"`, escape closes, focus on open
- Stepper: `aria-current="page"`; future steps disabled until allowed

---

## 💾 Persistence & Reset

- Saves to **`localStorage` key: `ssp.form`**
- Debounced save while typing **only** merges valid, non-empty fields
- Global **Reset** clears storage + in‑memory data and returns to Step 1
- Success page also clears and hides nav

---

## 🤖 AI “Help me write”

- Button under each Step 3 textarea
- Opens a modal, generates a suggestion, lets you **Accept / Edit / Discard**
- Uses **gpt-3.5-turbo** with a neutral, first‑person style prompt
- Graceful error handling (timeout, 401/429, retry)
- Implemented via:
  - `openaiClient.js` (axios instance + header interceptor)
  - `useOpenAI.generate({ notes, section, lang })`

---

## 🔌 HTTP Clients & Interceptors

- **apiClient** (your backend)
  - Base URL from `VITE_API_BASE` (default `/`)
  - 401 interceptor hook (optional redirect)
  - `mockSubmit(payload)` simulates latency + 1/6 failure for error UI testing
- **openaiClient** (OpenAI)
  - Base URL `https://api.openai.com/v1`
  - Request interceptor injects `Authorization: Bearer <VITE_OPENAI_API_KEY>`
  - Errors normalized for friendly messages

Hooks:
- `useApi` — wraps `apiClient` with `loading`, `error`, `get/post`, **timeout** via `timeoutMs`, and **cancel**
- `useOpenAI` — wraps `openaiClient.suggestText` with `loading`, `error`, `generate`, and **cancel**

---

## 🧪 Testing (brief)

- Jest + React Testing Library (basic tests around Step 1 form)
- ESLint configured for Jest globals when running tests
- Run:  
  ```bash
  npm run test
  ```

---

## 📚 Docs

- See **[docs/Architecture.md](docs/Architecture.md)** and **[docs/API-and-AI.md](docs/API-and-AI.md)** for a deeper dive.

---

## 🛠 Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the build locally
npm run test      # run unit tests (if set up)
```

---

## 🔒 Security Note

For the assignment, the OpenAI call is made from the browser to simplify setup.  
In production, route requests through your own server (proxy) and **never** expose API keys to clients.
