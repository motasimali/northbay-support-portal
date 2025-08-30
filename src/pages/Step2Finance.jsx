import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFormContext } from "../hooks/useFormContext";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  familySchema,
  MARITAL,
  EMPLOYMENT,
  HOUSING,
} from "../validation/schemas";
import { SelectInput } from "../components/controls/SelectInput";
import { TextInput } from "../components/controls/TextInput";

export default function Step2Finance() {
  const nav = useNavigate();
  const { data, setData, registerPageReset, resumed } = useFormContext();
  const { t } = useTranslation();
  const hydratedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset: formReset,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(familySchema),
    defaultValues: data.family,
  });

  // Rehydrate on resume (reload)
  useEffect(() => {
    if (resumed && !hydratedRef.current) {
      formReset(data.family);
      hydratedRef.current = true;
    }
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

  // Save-on-typing: merge only fields that are currently valid (no error)
  const watched = watch([
    "maritalStatus",
    "dependents",
    "employmentStatus",
    "income",
    "housingStatus",
  ]);
  useEffect(() => {
    const id = setTimeout(() => {
      const v = getValues();
      const update = {};
      // add only valid + non-empty fields so we don't overwrite good data with invalid
      [
        "maritalStatus",
        "dependents",
        "employmentStatus",
        "income",
        "housingStatus",
      ].forEach((k) => {
        if (!errors?.[k] && v[k] !== undefined && v[k] !== "") {
          update[k] = v[k];
        }
      });
      if (Object.keys(update).length === 0) return;
      setData((d) => ({ ...d, family: { ...(d.family || {}), ...update } }));
    }, 400);
    return () => clearTimeout(id);
  }, [watched, errors, getValues, setData]);

  const onSubmit = (values) => {
    setData((d) => ({ ...d, family: values }));
    nav("/step-3");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold">{t("steps.family")}</h2>

      {/* Marital Status */}

      <SelectInput
        required
        label={t("fields.maritalStatus")}
        error={errors.maritalStatus?.message}
        defaultValue={data.family.maritalStatus || ""}
        {...register("maritalStatus")}
      >
        <option value="">{t("placeholders.maritalStatus")}</option>
        {MARITAL.map((k) => (
          <option key={k} value={k}>
            {t(`options.marital.${k}`)}
          </option>
        ))}
      </SelectInput>

      {/* Dependents */}
      <TextInput
        required
        label={t("fields.dependents")}
        error={errors.dependents?.message}
        type="number"
        min={0}
        step={1}
        placeholder={t("placeholders.dependents")}
        {...register("dependents", { valueAsNumber: true })}
      />

      {/* Employment Status */}
      <SelectInput
        required
        label={t("fields.employmentStatus")}
        error={errors.employmentStatus?.message}
        {...register("employmentStatus")}
      >
        <option value="">{t("placeholders.employmentStatus")}</option>
        {EMPLOYMENT.map((k) => (
          <option key={k} value={k}>
            {t(`options.employment.${k}`)}
          </option>
        ))}
      </SelectInput>

      {/* Monthly Income */}
      <TextInput
        required
        label={t("fields.income")}
        error={errors.income?.message}
        type="text"
        inputMode="decimal"
        placeholder={t("placeholders.income")}
        {...register("income", { valueAsNumber: true })}
      />

      {/* Housing Status */}
      <SelectInput
        required
        label={t("fields.housingStatus")}
        error={errors.housingStatus?.message}
        defaultValue={data.family.housingStatus || ""}
        {...register("housingStatus")}
      >
        <option value="">{t("placeholders.housingStatus")}</option>
        {HOUSING.map((k) => (
          <option key={k} value={k}>
            {t(`options.housing.${k}`)}
          </option>
        ))}
      </SelectInput>

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
