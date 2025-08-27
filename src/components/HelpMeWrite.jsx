import { useState } from "react";
import Modal from "./Modal";
import LoadingButton from "./LoadingButton";
import { useTranslation } from "react-i18next";
import { suggestText } from "../lib/openaiClient";

export default function HelpMeWrite({
  open,
  onClose,
  sectionLabel,   // e.g., "Current Financial Situation"
  seedText = "",  // current textarea text
  onAccept,       // callback(text)
}) {
  const { i18n, t } = useTranslation();
  const [notes, setNotes] = useState(seedText || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const charCount = notes.trim().length;
  const disabledGenerate = loading || charCount < 10;

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const s = await suggestText({
        notes,
        section: sectionLabel,
        lang: i18n.language,
      });
      setSuggestion(s);
    } catch (e) {
      setError(e?.message || "Something went wrong.");
      setSuggestion("");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-gray-500">
        {charCount} {t("chars", { defaultValue: "chars" })}
      </p>
      <div className="flex gap-2">
        <button onClick={onClose} className="rounded-xl border px-4 py-2 cursor-pointer">
          {t("actions.back")}
        </button>
        {!suggestion ? (
          <LoadingButton
            onClick={handleGenerate}
            loading={loading}
            disabled={disabledGenerate}
            className="bg-black text-white cursor-pointer"
          >
            {t("generate", { defaultValue: "Generate" })}
          </LoadingButton>
        ) : (
          <>
            <button
              onClick={() => {
                onAccept?.(suggestion);
                onClose?.();
              }}
              className="rounded-xl bg-black px-4 py-2 text-white cursor-pointer"
            >
              {t("accept", { defaultValue: "Accept" })}
            </button>
            <button
              onClick={() => setSuggestion("")}
              className="rounded-xl border px-4 py-2 cursor-pointer"
            >
              {t("discard", { defaultValue: "Discard" })}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("helpMeWriteTitle", { defaultValue: "Help me write" })}
      footer={footer}
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-700">
          {t("section", { defaultValue: "Section" })}:{" "}
          <span className="font-medium">{sectionLabel}</span>
        </div>

        <label className="block">
          <span className="text-sm text-gray-700">
            {t("yourNotes", { defaultValue: "Your notes (min 10 chars)" })}
          </span>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notesPlaceholder", {
              defaultValue:
                "Key facts, constraints, who's impacted, timelines…",
            })}
          />
        </label>

        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
            aria-live="assertive"
          >
            {error}{" "}
            <button
              type="button"
              onClick={handleGenerate}
              className="underline cursor-pointer"
              disabled={loading}
            >
              {t("retry", { defaultValue: "Retry" })}
            </button>
          </p>
        )}

        {suggestion !== "" && (
          <div className="space-y-2">
            <span className="text-sm text-gray-700">
              {t("editSuggestion", { defaultValue: "Edit suggestion" })}
            </span>
            <textarea
              className="w-full rounded-lg border px-3 py-2"
              rows={6}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
