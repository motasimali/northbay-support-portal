import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { submitForm } from "../lib/api";
import LoadingButton from "../components/LoadingButton";
import { formatNumber } from "../lib/numberFormat";

export default function Review() {
  const nav = useNavigate();
  const { data } = useFormContext();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await submitForm(data);
      nav("/success", { replace: true });
    } catch (e) {
      setError(e?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const P = data.personal;
  const F = data.family;
  const S = data.situation;

  const label = (path) => t(path);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{t("steps.review")}</h2>

      {/* Step 1 */}
      <section className="space-y-2">
        <h3 className="font-medium">{t("steps.personal")}</h3>
        <p><span className="text-gray-500">{label("fields.name")}:</span> {P.name || "—"}</p>
        <p><span className="text-gray-500">{label("fields.nationalId")}:</span> {P.nationalId || "—"}</p>
        <p><span className="text-gray-500">{label("fields.dob")}:</span> {P.dob || "—"}</p>
        <p><span className="text-gray-500">{label("fields.gender")}:</span> {P.gender || "—"}</p>
        <p><span className="text-gray-500">{label("fields.address")}:</span> {P.address || "—"}</p>
        <p><span className="text-gray-500">{label("fields.city")}:</span> {P.city || "—"}</p>
        <p><span className="text-gray-500">{label("fields.state")}:</span> {P.state || "—"}</p>
        <p><span className="text-gray-500">{label("fields.country")}:</span> {P.country || "—"}</p>
        <p><span className="text-gray-500">{label("fields.phone")}:</span> {P.phone || "—"}</p>
        <p><span className="text-gray-500">{label("fields.email")}:</span> {P.email || "—"}</p>
      </section>

      {/* Step 2 */}
      <section className="space-y-2">
        <h3 className="font-medium">{t("steps.family")}</h3>
        <p>
          <span className="text-gray-500">{label("fields.maritalStatus")}:</span>{" "}
          {F.maritalStatus ? t(`options.marital.${F.maritalStatus}`) : "—"}
        </p>
        <p>
          <span className="text-gray-500">{label("fields.dependents")}:</span>{" "}
          {F.dependents ?? "—"}
        </p>
        <p>
          <span className="text-gray-500">{label("fields.employmentStatus")}:</span>{" "}
          {F.employmentStatus ? t(`options.employment.${F.employmentStatus}`) : "—"}
        </p>
        <p>
          <span className="text-gray-500">{label("fields.income")}:</span>{" "}
          {formatNumber(F.income) ?? "—"}
        </p>
        <p>
          <span className="text-gray-500">{label("fields.housingStatus")}:</span>{" "}
          {F.housingStatus ? t(`options.housing.${F.housingStatus}`) : "—"}
        </p>
      </section>

      {/* Step 3 */}
      <section className="space-y-2">
        <h3 className="font-medium">{t("steps.situation")}</h3>
        <p className="whitespace-pre-wrap">
          <span className="text-gray-500">{label("fields.financial")}:</span> {S.financial || "—"}
        </p>
        <p className="whitespace-pre-wrap">
          <span className="text-gray-500">{label("fields.employment")}:</span> {S.employment || "—"}
        </p>
        <p className="whitespace-pre-wrap">
          <span className="text-gray-500">{label("fields.reason")}:</span> {S.reason || "—"}
        </p>
      </section>

      {error && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}

      <div className="flex justify-between gap-3 pt-4">
        <button disabled={submitting} onClick={() => nav("/step-3")} className="rounded-xl border px-4 py-2 cursor-pointer">
          {t("actions.back")}
        </button>
        <div className="flex gap-2">
          <LoadingButton onClick={onSubmit} loading={submitting} className="bg-black text-white cursor-pointer">
            {t("actions.submit")}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
