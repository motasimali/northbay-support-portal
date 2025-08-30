import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/apiClient";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const request = useCallback(async (method, url, data, config) => {
    setLoading(true);
    setError(null);
    const { timeoutMs, ...axiosCfg } = config || {};
    const controller = new AbortController();
    controllerRef.current = controller;
    let timer;
    if (timeoutMs && Number.isFinite(timeoutMs)) {
      timer = setTimeout(() => controller.abort(), timeoutMs);
    }
    try {
      const res = await api.request({
        method,
        url,
        data,
        signal: controller.signal,
        ...axiosCfg,
      });
      return res.data;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
      if (timer) clearTimeout(timer);
      controllerRef.current = null;
    }
  }, []);

  const get = useCallback(
    (url, config) => request("get", url, undefined, config),
    [request]
  );
  const post = useCallback(
    (url, data, config) => request("post", url, data, config),
    [request]
  );

  useEffect(() => () => cancel(), [cancel]);

  return { get, post, request, loading, error, cancel };
}
