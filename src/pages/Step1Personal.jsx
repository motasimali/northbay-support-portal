import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { makeResolver } from "../validation/rhfResolver";
import { validatePersonal } from "../validation/validators";
import { useFormContext } from "../context/FormContext";
import { Field } from "../components/Field";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Step1Personal() {
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
    resolver: makeResolver(validatePersonal),
    defaultValues: data.personal,
  });

  // Rehydrate on resume (reload)
  useEffect(() => {
    if (resumed) formReset(data.personal);
  }, [resumed, data.personal, formReset]);

  // Global Reset support
  useEffect(() => {
    const fn = () =>
      formReset({
        name: "",
        nationalId: "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        email: "",
      });
    registerPageReset(fn);
    return () => registerPageReset(null);
  }, [registerPageReset, formReset]);

  const onSubmit = (values) => {
    setData((d) => ({ ...d, personal: values }));
    nav("/step-2");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold">{t("steps.personal")}</h2>

      <Field label={t("fields.name")} error={errors.name?.message}>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("placeholders.name")}
          {...register("name")}
        />
      </Field>

      <Field label={t("fields.nationalId")} error={errors.nationalId?.message}>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("placeholders.nationalId")}
          {...register("nationalId")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("fields.dob")} error={errors.dob?.message}>
          <input
            className="w-full rounded-lg border px-3 py-2"
            type="date"
            placeholder={t("placeholders.dob")}
            {...register("dob")}
          />
        </Field>

        <Field label={t("fields.gender")} error={errors.gender?.message}>
          <select
            className="w-full rounded-lg border px-3 py-2"
            defaultValue={data.personal.gender || ""}
            {...register("gender")}
          >
            <option value="">{t("placeholders.gender")}</option>
            <option value="male">{t("options.gender.male")}</option>
            <option value="female">{t("options.gender.female")}</option>
            <option value="other">{t("options.gender.other")}</option>
            <option value="prefer_not">
              {t("options.gender.prefer_not")}
            </option>
          </select>
        </Field>
      </div>

      <Field label={t("fields.address")} error={errors.address?.message}>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("placeholders.address")}
          {...register("address")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label={t("fields.city")} error={errors.city?.message}>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder={t("placeholders.city")}
            {...register("city")}
          />
        </Field>

        <Field label={t("fields.state")} error={errors.state?.message}>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder={t("placeholders.state")}
            {...register("state")}
          />
        </Field>

        <Field label={t("fields.country")} error={errors.country?.message}>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder={t("placeholders.country")}
            {...register("country")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("fields.phone")} error={errors.phone?.message}>
          <input
            className="w-full rounded-lg border px-3 py-2"
            type="tel"
            inputMode="tel"
            placeholder={t("placeholders.phone")}
            {...register("phone")}
          />
        </Field>

        <Field label={t("fields.email")} error={errors.email?.message}>
          <input
            className="w-full rounded-lg border px-3 py-2"
            type="email"
            placeholder={t("placeholders.email")}
            autoComplete="email"
            {...register("email")}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-4">
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
