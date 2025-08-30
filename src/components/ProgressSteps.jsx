import { Link, useLocation } from "react-router-dom";
import { useFormContext } from "../hooks/useFormContext";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  isStep1Complete,
  isStep2Complete,
} from "../lib/stepCompletion";

export default function ProgressSteps() {
  const { steps, data } = useFormContext();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const activeIndex = Math.max(0, steps.findIndex((s) => s.path === pathname));
  const isReview = pathname === "/review" || pathname === "/success";
  const pct = isReview ? 100 : ((activeIndex + 1) / steps.length) * 100;

  // Compute last step the user is allowed to visit (current + previous complete)
  const can1 = true; // step 1 always allowed
  const can2 = isStep1Complete(data);
  const can3 = can2 && isStep2Complete(data);
  const canVisit = [can1, can2, can3]; // index 0..2

  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="mb-2 flex items-center justify-between" role="list">
        {steps.map((step, i) => {
          const isActive = i === activeIndex;
          const enabled = canVisit[i];
          const className = clsx(
            "text-sm",
            isActive ? "font-semibold text-gray-900 cursor-pointer" : "text-gray-600",
            !enabled && "opacity-60"
          );

          if (enabled) {
            return (
              <li key={step.id}>
                <Link
                  to={step.path}
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                >
                  {t(step.labelKey)}
                </Link>
              </li>
            );
          }

          // Disabled future step: render a <span> with aria-disabled
          return (
            <li key={step.id}>
              <span
                className={className}
                aria-disabled="true"
                title={t("banners.resumed") /* harmless short tooltip; or remove */}
              >
                {t(step.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="h-2 w-full rounded-full bg-gray-200" aria-hidden="true">
        <div
          className="h-2 rounded-full bg-gray-900 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </nav>
  );
}
