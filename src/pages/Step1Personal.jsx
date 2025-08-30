import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFormContext } from "../hooks/useFormContext";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema } from "../validation/schemas";
import { TextInput } from "../components/controls/TextInput";
import { SelectInput } from "../components/controls/SelectInput";

export default function Step1Personal() {
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
    resolver: zodResolver(personalSchema),
    defaultValues: data.personal,
  });

  // Rehydrate on resume (reload)
  useEffect(() => {
    if (resumed && !hydratedRef.current) {
      formReset(data.personal);
      hydratedRef.current = true;
    }
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

  // Save-on-typing: merge only fields that are currently valid (no error)
  const watched = watch([
    "name",
    "nationalId",
    "dob",
    "gender",
    "address",
    "city",
    "state",
    "country",
    "phone",
    "email",
  ]);
  useEffect(() => {
    const id = setTimeout(() => {
      const v = getValues();
      const update = {};
      // add only valid + non-empty fields so we don't overwrite good data with invalid
      [
        "name",
        "nationalId",
        "dob",
        "gender",
        "address",
        "city",
        "state",
        "country",
        "phone",
        "email",
      ].forEach((k) => {
        if (!errors?.[k] && v[k] !== undefined && v[k] !== "") {
          update[k] = v[k];
        }
      });
      if (Object.keys(update).length === 0) return;
      setData((d) => ({ ...d, personal: { ...(d.personal || {}), ...update } }));
    }, 400);
    return () => clearTimeout(id);
  }, [watched, errors, getValues, setData]);

  const onSubmit = (values) => {
    setData((d) => ({ ...d, personal: values }));
    nav("/step-2");
  };
  
    
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold">{t("steps.personal")}</h2>

      <TextInput
        required
        label={t("fields.name")}
        error={errors.name?.message}
        placeholder={t("placeholders.name")}
        {...register("name")}
      />

      <TextInput
        required
        label={t("fields.nationalId")}
        error={errors.nationalId?.message}
        placeholder={t("placeholders.nationalId")}
        {...register("nationalId")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          required
          label={t("fields.dob")}
          error={errors.dob?.message}
          type="date"
          placeholder={t("placeholders.dob")}
          {...register("dob")}
        />

        <SelectInput
          required
          label={t("fields.gender")}
          error={errors.gender?.message}
          {...register("gender")}
        >
          <option value="">{t("placeholders.gender")}</option>
          <option value="male">{t("options.gender.male")}</option>
          <option value="female">{t("options.gender.female")}</option>
          <option value="other">{t("options.gender.other")}</option>
          <option value="prefer_not">{t("options.gender.prefer_not")}</option>
        </SelectInput>
      </div>

      <TextInput
        required
        label={t("fields.address")}
        error={errors.address?.message}
        placeholder={t("placeholders.address")}
        {...register("address")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextInput
          required
          label={t("fields.city")}
          error={errors.city?.message}
          placeholder={t("placeholders.city")}
          {...register("city")}
        />

        <TextInput
          required
          label={t("fields.state")}
          error={errors.state?.message}
          placeholder={t("placeholders.state")}
          {...register("state")}
        />

        <TextInput
          required
          label={t("fields.country")}
          error={errors.country?.message}
          placeholder={t("placeholders.country")}
          {...register("country")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          required
          label={t("fields.phone")}
          error={errors.phone?.message}
          type="tel"
          inputMode="tel"
          placeholder={t("placeholders.phone")}
          {...register("phone")}
        />

        <TextInput
          required
          label={t("fields.email")}
          error={errors.email?.message}
          type="email"
          placeholder={t("placeholders.email")}
          autoComplete="email"
          {...register("email")}
        />
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
