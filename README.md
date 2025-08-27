# Social Support Portal (React + Vite + Tailwind)

A small, accessible, multi-step form built with React, Vite, Tailwind, and React Hook Form.  
It saves progress to localStorage, supports English/Arabic, and includes an AI **Help me write** assistant powered by OpenAI Chat Completions.

---

## ✨ Features

- **Three-step wizard** + Review + Success  
  1) Personal Info  
  2) Family & Financial  
  3) Situation (3 textareas with AI assist)
- **Validation**: plain JS validators + custom RHF resolver
- **Persistence**: auto-saves to `localStorage` under **`ssp.form`**
- **Guarded navigation**: can’t jump to later steps until previous ones are valid
- **Reset flow**: clears inputs + localStorage and returns to Step 1
- **Internationalization**: English / Arabic with automatic LTR/RTL
- **Accessibility**: labeled fields, `aria-describedby`, live error announcements, accessible modal, keyboard support, skip link
- **AI integration**: “Help me write” uses **gpt-3.5-turbo** with neutral, first-person output

---

## 🧰 Tech Stack

- React + Vite + Tailwind CSS  
- React Router  
- React Hook Form (custom resolver)  
- i18next (react-i18next)  
- OpenAI Chat Completions API


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
> For this assignment, we call OpenAI **from the browser** (simple, but not secure for production).

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
Do **not** expose API keys client-side in real apps. Use a small server proxy (e.g., Express/Next API route) and keep `OPENAI_API_KEY` on the server. Then point the frontend to your proxy endpoint.

---

## 🗂️ Project Structure

```text
src/
  components/
    Field.jsx
    HelpMeWrite.jsx
    LoadingButton.jsx
    Modal.jsx
    ProgressSteps.jsx
    SkipLink.jsx
  context/
    FormContext.jsx            # Provider + Context + useFormContext (co-located)
  i18n/
    index.js                   # English/Arabic strings & dir switching
  layouts/
    RootLayout.jsx             # Header, language switch, stepper
  lib/
    numberFormat.js
    openaiClient.js            # Calls OpenAI; model/key via env
    stepCompletion.js          # Helpers used by the route guard
    storage.js                 # load/save/clear localStorage "ssp.form"
  pages/
    Step1Personal.jsx
    Step2FamilyFinance.jsx
    Step3Situation.jsx
    Review.jsx
    Success.jsx
  routes/
    RequireStep.jsx            # Route guard: block access until prior steps valid
  validation/
    rhfResolver.js             # Bridge plain validators to RHF
    validators.js              # Plain JS validation for steps 1–3
  App.jsx
  main.jsx
  index.css
```

---

## 🧭 App Flow

- **Step 1 → Next** ⇒ save `personal`, go to Step 2  
- **Step 2 → Next** ⇒ save `family`, go to Step 3  
- **Step 3 → Review** ⇒ save `situation`, go to Review  
- **Submit** ⇒ navigate to **/success** first; Success page clears context + `localStorage`
- **Route Guard (`RequireStep`)**: prevents visiting Step 2/3/Review unless previous steps validate.  
  It checks both **context** and **localStorage** and uses whichever snapshot is **farther along** (so no “double-click to proceed” issue and works after refresh).

---

## ✅ Validation

- Plain validators in `src/validation/validators.js`
- Custom RHF resolver in `src/validation/rhfResolver.js`
- The **same validators** are used by the forms **and** the route guard

**Examples**
- **Date of Birth**: strict `YYYY-MM-DD`, leap-year aware, not in the future
- **Phone**: E.164-ish (e.g., `+9715XXXXXXXX`)
- **Textareas (Step 3)**: **≥ 20 characters** (trimmed)

---

## ♿ Accessibility

- Semantic HTML, labeled inputs, `aria-describedby` linking hints/errors
- Errors announced via `role="alert"` (assertive)
- Modal: `role="dialog"`, `aria-modal="true"`, focus management, ESC to close
- Stepper: `aria-current="page"`; future steps non-interactive until allowed
- **Skip to main content** link
- On failed submit, focus jumps to the first invalid input

---

## 💾 Persistence & Reset

- Saves to **`localStorage` key: `ssp.form`**
- **Reset** button clears storage + in-memory data and returns to Step 1
- Success page clears everything on mount; stepper nav is hidden on `/success`

---

## 🤖 AI “Help me write”

- Button under each Step 3 textarea
- Opens a modal, generates a suggestion, lets you **Accept / Edit / Discard**
- Uses **gpt-3.5-turbo** :
  - Neutral, plain style
  - **First-person singular** (“I”, unless user notes say “we”)
  - Few-shot examples discourage corporate phrasing (“acknowledge”, etc.)
- Graceful error handling (timeout/retry)

> Config lives in `src/lib/openaiClient.js` and reads `VITE_OPENAI_API_KEY` / `VITE_OPENAI_MODEL`.

---

## 🛠 Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the build locally
```

---

## 🔒 Security Note

For the assignment, the OpenAI call is made from the browser to simplify setup.  
In production, route requests through your own server (proxy) and **never** expose API keys to clients.
