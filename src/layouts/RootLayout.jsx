// src/layouts/RootLayout.jsx
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import ProgressSteps from "../components/ProgressSteps";
import { useFormContext } from "../context/FormContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
  const { reset, resumed } = useFormContext();
  const { t } = useTranslation();
  const nav = useNavigate();
  const { pathname } = useLocation();

  // Hide progress nav on the success page after submission
  const hideProgressNav = pathname === "/success";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/step-1" className="text-base font-semibold">
            {t("app.title", {
              ns: "common",
              defaultValue: "Social Support Portal",
            })}
          </Link>

          <div className="flex items-center gap-2">
            {!hideProgressNav && (
              <button
                onClick={() => reset(nav)}
                className="rounded-xl border px-3 py-1.5 text-sm cursor-pointer"
              >
                {t("actions.reset")}
              </button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 py-8">
        {!hideProgressNav && <ProgressSteps />}

        {resumed && !hideProgressNav && (
          <p
            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            role="status"
          >
            {t("banners.resumed")}
          </p>
        )}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
