import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { makeResolver } from "../validation/rhfResolver";
import { validateSituation } from "../validation/validators";
import { useFormContext } from "../context/FormContext";
import { Field } from "../components/Field";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import HelpMeWrite from "../components/HelpMeWrite";

export default function Step3Situation() {
  const nav = useNavigate();
  const { data, setData, registerPageReset, resumed } = useFormContext();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
    reset: formReset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: makeResolver(validateSituation),
    defaultValues: data.situation,
  });

  // Rehydrate on reload
  useEffect(() => {
    if (resumed) formReset(data.situation);
  }, [resumed, data.situation, formReset]);

  // Global Reset support
  useEffect(() => {
    const fn = () =>
      formReset({
        financial: "",
        employment: "",
        reason: "",
      });
    registerPageReset(fn);
    return () => registerPageReset(null);
  }, [registerPageReset, formReset]);

  // Modal state
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); // "financial" | "employment" | "reason"

  const openHelp = (field) => {
    setActiveField(field);
    setHelpOpen(true);
  };

  const onSubmit = (values) => {
    setData((oldValues) => ({ ...oldValues, situation: values }));
    nav("/review");
  };

  const currentValues = watch();
  const labels = {
    financial: t("fields.financial"),
    employment: t("fields.employment"),
    reason: t("fields.reason"),
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold">{t("steps.situation")}</h2>

        <Field
          label={t("fields.financial")}
          hint={t("fields.descriptionHint")}
          error={errors.financial?.message}
        >
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            rows={5}
            placeholder={t("placeholders.financial")}
            {...register("financial")}
          />
          <div className="mt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={() => openHelp("financial")}
              className="rounded border px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {t("helpMeWriteTitle", { defaultValue: "Help me write" })}
            </button>
          </div>
        </Field>

        <Field
          label={t("fields.employment")}
          hint={t("fields.descriptionHint")}
          error={errors.employment?.message}
        >
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            rows={5}
            placeholder={t("placeholders.employment")}
            {...register("employment")}
          />
          <div className="mt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={() => openHelp("employment")}
              className="rounded border px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {t("helpMeWriteTitle", { defaultValue: "Help me write" })}
            </button>
          </div>
        </Field>

        <Field
          label={t("fields.reason")}
          hint={t("fields.descriptionHint")}
          error={errors.reason?.message}
        >
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            rows={5}
            placeholder={t("placeholders.reason")}
            {...register("reason")}
          />
          <div className="mt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={() => openHelp("reason")}
              className="rounded border px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {t("helpMeWriteTitle", { defaultValue: "Help me write" })}
            </button>
          </div>
        </Field>

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => nav("/step-2")}
            className="rounded-xl border px-4 py-2"
          >
            {t("actions.back")}
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? "…" : t("actions.review")}
          </button>
        </div>
      </form>

      {/* Help modal */}
      {helpOpen && activeField && (
        <HelpMeWrite
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          sectionLabel={labels[activeField]}
          seedText={currentValues?.[activeField] || ""}
          onAccept={(text) => {
            setValue(activeField, text, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      )}
    </>
  );
}
