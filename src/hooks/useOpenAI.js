import { useCallback, useEffect, useRef, useState } from "react";
import { suggestText } from "../lib/openaiClient";

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const generate = useCallback(
    async ({ notes, section, lang = "en", timeoutMs = 15000 }) => {
      setLoading(true);
      setError(null);

      cancel();

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const text = await suggestText({
          notes,
          section,
          lang,
          timeoutMs,
          signal: controller.signal,
        });
        return text;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
        controllerRef.current = null;
      }
    },
    [cancel]
  );

  // Auto-cancel on unmount
  useEffect(() => () => cancel(), [cancel]);

  return { generate, loading, error, cancel };
}
