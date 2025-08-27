const MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function suggestText({
  notes,
  section,
  lang = "en",
  timeoutMs = 15000,
}) {
  if (!API_KEY) {
    throw new Error("Missing VITE_OPENAI_API_KEY. Add it to your .env file.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

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
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0.2,
      }),
    });

    clearTimeout(timer);

    if (!res.ok) {
      let msg = "Suggestion request failed.";
      try {
        const err = await res.json();
        if (err?.error?.message) msg = err.error.message;
      } catch (err) {
        console.log(err);
      }
      throw new Error(msg);
    }

    const data = await res.json();
    const suggestion = data?.choices?.[0]?.message?.content?.trim();
    if (!suggestion) throw new Error("No suggestion text returned.");
    return suggestion;
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }
    throw e;
  }
}
