import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { makeResolver } from "../validation/rhfResolver";
import {
  validateFamily,
  MARITAL,
  EMPLOYMENT,
  HOUSING,
} from "../validation/validators";
import { useFormContext } from "../context/FormContext";
import { Field } from "../components/Field";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Step2Finance() {
  const nav = useNavigate();
  const { data, setData, registerPageReset, resumed } = useFormContext();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset: formReset,
  } = useForm({
    mode: "onChange",
    resolver: makeResolver(validateFamily),
    defaultValues: data.family,
  });

  // Rehydrate on reload
  useEffect(() => {
    if (resumed) formReset(data.family);
  }, [resumed, data.family, formReset]);

  // Global Reset support
  useEffect(() => {
    const fn = () =>
      formReset({
        maritalStatus: "",
        dependents: 0,
        employmentStatus: "",
        income: undefined,
        housingStatus: "",
      });
    registerPageReset(fn);
    return () => registerPageReset(null);
  }, [registerPageReset, formReset]);



  const onSubmit = (values) => {
    setData((d) => ({ ...d, family: values }));
    nav("/step-3");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold">{t("steps.family")}</h2>

      {/* Marital Status */}
      <Field
        label={t("fields.maritalStatus")}
        error={errors.maritalStatus?.message}
      >
        <select
          className="w-full rounded-lg border px-3 py-2"
          defaultValue={data.family.maritalStatus || ""}
          {...register("maritalStatus")}
        >
          <option value="">{t("placeholders.maritalStatus")}</option>
          {MARITAL.map((k) => (
            <option key={k} value={k}>
              {t(`options.marital.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      {/* Dependents */}
      <Field label={t("fields.dependents")} error={errors.dependents?.message}>
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="number"
          min={0}
          step={1}
          {...register("dependents", { valueAsNumber: true })}
          placeholder={t("placeholders.dependents")}
        />
      </Field>

      {/* Employment Status */}
      <Field
        label={t("fields.employmentStatus")}
        error={errors.employmentStatus?.message}
      >
        <select
          className="w-full rounded-lg border px-3 py-2"
          defaultValue={data.family.employmentStatus || ""}
          {...register("employmentStatus")}
        >
          <option value="">{t("placeholders.employmentStatus")}</option>
          {EMPLOYMENT.map((k) => (
            <option key={k} value={k}>
              {t(`options.employment.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      {/* Monthly Income */}
      <Field label={t("fields.income")} error={errors.income?.message}>
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="text"
          inputMode="decimal"
          {...register("income", { valueAsNumber: true })}
          placeholder={t("placeholders.income")}
        />
      </Field>

      {/* Housing Status */}
      <Field
        label={t("fields.housingStatus")}
        error={errors.housingStatus?.message}
      >
        <select
          className="w-full rounded-lg border px-3 py-2"
          defaultValue={data.family.housingStatus || ""}
          {...register("housingStatus")}
        >
          <option value="">{t("placeholders.housingStatus")}</option>
          {HOUSING.map((k) => (
            <option key={k} value={k}>
              {t(`options.housing.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex justify-between gap-3 pt-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => nav("/step-1")}
          className="rounded-xl border px-4 py-2 cursor-pointer"
        >
          {t("actions.back")}
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "…" : t("actions.next")}
        </button>
      </div>
    </form>
  );
}
