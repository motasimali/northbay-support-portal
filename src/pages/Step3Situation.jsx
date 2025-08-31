import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFormContext } from "../hooks/useFormContext";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import HelpMeWrite from "../components/HelpMeWrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { situationSchema } from "../validation/schemas";
import { TextArea } from "../components/controls/TextArea";

export default function Step3Situation() {
  const nav = useNavigate();
  const { data, setData, registerPageReset, resumed } = useFormContext();
  const { t } = useTranslation();
  const hydratedRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
    reset: formReset,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(situationSchema),
    defaultValues: data.situation,
  });

  // Rehydrate on resume (reload)
  useEffect(() => {
    if (resumed && !hydratedRef.current) {
      formReset(data.situation);
      hydratedRef.current = true;
    }
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

  const handleClose = useCallback(() => setHelpOpen(false), []);

  const onSubmit = (values) => {
    setData((oldValues) => ({ ...oldValues, situation: values }));
    nav("/review");
  };

  const [financial, employment, reason] = watch([
    "financial",
    "employment",
    "reason",
  ]);

  const MIN = 20;
  const isValidField = (v) => (v?.trim()?.length || 0) >= MIN;
  const valid = {
    financial: isValidField(financial),
    employment: isValidField(employment),
    reason: isValidField(reason),
  };

  // Save-on-typing (debounced): merge only fields that are currently valid (no error)
  useEffect(() => {
    const id = setTimeout(() => {
      const v = getValues();
      const update = {};
      ["financial", "employment", "reason"].forEach((k) => {
        if (!errors?.[k] && v[k] !== undefined && v[k] !== "") {
          update[k] = v[k];
        }
      });
      if (Object.keys(update).length === 0) return;
      setData((d) => ({
        ...d,
        situation: { ...(d.situation || {}), ...update },
      }));
    }, 400);
    return () => clearTimeout(id);
  }, [financial, employment, reason, errors, getValues, setData]);

  const labels = {
    financial: t("fields.financial"),
    employment: t("fields.employment"),
    reason: t("fields.reason"),
  };

  const currentByField = { financial, employment, reason };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold">{t("steps.situation")}</h2>

        <TextArea
          required
          label={t("fields.financial")}
          hint={t("fields.descriptionHint")}
          error={errors.financial?.message}
          rows={5}
          placeholder={t("placeholders.financial")}
          {...register("financial")}
        >
          <div className="mt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              disabled={!valid.financial}
              onClick={() => openHelp("financial")}
              className="disabled:opacity-50 disabled:cursor-default rounded border px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {t("helpMeWriteTitle", { defaultValue: "Help me write" })}
            </button>
          </div>
        </TextArea>

        <TextArea
          required
          label={t("fields.employment")}
          hint={t("fields.descriptionHint")}
          error={errors.employment?.message}
          rows={5}
          placeholder={t("placeholders.employment")}
          {...register("employment")}
        >
          <div className="mt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              disabled={!valid.employment}
              onClick={() => openHelp("employment")}
              className="disabled:opacity-50 disabled:cursor-default rounded border px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {t("helpMeWriteTitle", { defaultValue: "Help me write" })}
            </button>
          </div>
        </TextArea>

        <TextArea
          required
          label={t("fields.reason")}
          hint={t("fields.descriptionHint")}
          error={errors.reason?.message}
          rows={5}
          placeholder={t("placeholders.reason")}
          {...register("reason")}
        >
          <div className="mt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              disabled={!valid.reason}
              onClick={() => openHelp("reason")}
              className="disabled:opacity-50 disabled:cursor-default rounded border px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {t("helpMeWriteTitle", { defaultValue: "Help me write" })}
            </button>
          </div>
        </TextArea>

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => nav("/step-2")}
            className="cursor-pointer rounded-xl border px-4 py-2"
          >
            {t("actions.back")}
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="cursor-pointer rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-default"
          >
            {isSubmitting ? "…" : t("actions.review")}
          </button>
        </div>
      </form>

      {/* Help modal */}
      {helpOpen && activeField && (
        <HelpMeWrite
          open={helpOpen}
          onClose={handleClose}
          sectionLabel={labels[activeField]}
          seedText={currentByField?.[activeField] || ""}
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
