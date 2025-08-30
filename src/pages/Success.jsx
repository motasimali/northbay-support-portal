import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../hooks/useFormContext";

export default function Success() {
  const { t } = useTranslation();
  const { reset } = useFormContext();
  const titleRef = useRef(null);

  // Clear saved data after landing here, and focus the title for SR users.
  useEffect(() => {
    reset(); // clears context + localStorage ("ssp.form")
    titleRef.current?.focus();
  }, [reset]);

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <span className="text-2xl" aria-hidden="true">✅</span>
      </div>

      <h2
        ref={titleRef}
        tabIndex={-1}
        className="text-lg font-semibold"
        aria-live="polite"
      >
        {t("success.title")}
      </h2>

      <p className="text-gray-600">
        {t("success.subtitle")}
      </p>

      <div className="pt-2">
        <Link to="/step-1" className="rounded-xl border px-4 py-2">
          {t("success.cta")}
        </Link>
      </div>
    </div>
  );
}
