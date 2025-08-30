# HTTP & AI Integration

## Environment
```
VITE_API_BASE=/                 # your backend origin (optional)
VITE_OPENAI_API_KEY=sk-xxxx
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

## Axios Clients

### 1) `apiClient` (your API)
- Base URL: `VITE_API_BASE` (defaults to `/`)
- Timeout: 15s
- Interceptor: reserved 401 handler (redirect if needed)
- Utilities:
  - `mockSubmit(payload)` — simulates ~1/6 random failure for UI testing of steps form data

### 2) `openaiClient` (OpenAI)
- Base URL: `https://api.openai.com/v1`
- Header: `Authorization: Bearer <VITE_OPENAI_API_KEY>`
- Timeout: 15s
- Function:
  - `suggestText({ notes, section, lang, timeoutMs, signal })`
    - Keeps a **neutral** prompt, first-person singular, short/clear style
    - Returns a single suggestion string
    - Throws friendly errors (timeout, 401/429, API error body)

## Hooks

### `useApi`
- Generic wrapper around `apiClient` with:
  - `{ loading, error }` state
  - `get(url, config)`, `post(url, data, config)`
  - Cancel & timeout via `AbortController` and `timeoutMs` option

### `useOpenAI`
- Thin wrapper around `openaiClient.suggestText` with:
  - `{ loading, error }`
  - `generate({ notes, section, lang, timeoutMs })`
  - Cancel on unmount or when starting a new request


## Error Handling

- **App API**:
  - Handle 401 in `apiClient` interceptor (optional redirect).
  - Show inline error banners on Review when submit fails.
- **OpenAI**:
  - `useOpenAI` normalizes known failures (timeout, rate-limit).
  - “Retry” button in the modal triggers the same request.

