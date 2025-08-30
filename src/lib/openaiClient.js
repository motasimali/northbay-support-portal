import axios from "axios";

export const MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Dedicated axios instance for OpenAI so app interceptors don't interfere
const apiOpenAI = axios.create({
  baseURL: "https://api.openai.com/v1",
  timeout: 15000,
});

apiOpenAI.interceptors.request.use((config) => {
  if (!API_KEY) {
    throw new Error("Missing VITE_OPENAI_API_KEY. Add it to your .env file.");
  }
  config.headers = {
    ...(config.headers || {}),
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
  return config;
});

export async function suggestText({
  notes,
  section,
  lang = "en",
  timeoutMs = 15000,
  signal,
}) {
  // Prompt logic preserved 1:1 with your original
  const languageName = lang === "ar" ? "Arabic" : "English";
  const system = [
    `You help an applicant draft short, neutral statements for a social support application.`,
    `Write only in ${languageName}.`,
    `Use first-person SINGULAR ("I", "my") unless the user's notes clearly use "we"/"our".`,
    `Keep it plain, direct, and factual. Avoid corporate words like "acknowledge", "recognize", "uncertainty".`,
    `Preserve the user's meaning and facts. Do not add new facts.`,
    `If the notes address "you", convert to first-person ("I").`,
    `Target section: ${section}.`,
    `Length: if the notes are brief, reply with 1-2 sentences; if long, reply with one short paragraph (80-140 words).`,
  ].join(" ");

  const user = `User notes for "${section}": """${(notes || "").trim()}"""`;

  try {
    const { data } = await apiOpenAI.post(
      "/chat/completions",
      {
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0.2,
      },
      {
        signal,
        timeout: timeoutMs,
      }
    );

    const suggestion = data?.choices?.[0]?.message?.content?.trim();
    if (!suggestion) throw new Error("No suggestion text returned.");
    return suggestion;
  } catch (e) {
    // Timeout/cancel
    if (e.name === "CanceledError" || e.name === "AbortError") {
      throw new Error("The request timed out or was canceled.");
    }
    // OpenAI error body bubble-up
    const msg =
      e?.response?.data?.error?.message ||
      e?.message ||
      "Suggestion request failed.";
    throw new Error(msg);
  }
}
