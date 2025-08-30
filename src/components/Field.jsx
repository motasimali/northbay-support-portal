import { useId, isValidElement, cloneElement, Children } from "react";
import { useTranslation } from "react-i18next";

export function Field({ label, hint, error, children, inputId, required }) {
  const { t } = useTranslation();
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  let firstControlId = inputId || null;

  const enhanceFirstControl = (nodes) => {
    let enhanced = false;

    const enhance = (el) => {
      if (!isValidElement(el)) return el;

      // Only enhance the first form control we encounter
      const isNativeControl =
        typeof el.type === "string" &&
        (el.type === "input" || el.type === "textarea" || el.type === "select");

      if (!enhanced && isNativeControl) {
        enhanced = true;
        const chosenId = firstControlId || el.props.id || `${id}-control`;
        firstControlId = chosenId;
        return cloneElement(el, {
          required: required || el.props.required,
          "aria-required": required ? true : undefined,
          "aria-invalid": !!error,
          "aria-describedby":
            [hintId, errId].filter(Boolean).join(" ") || undefined,
          id: chosenId || el.props.id,
        });
      }
      return el;
    };

    // Children.toArray ensures children have stable keys
    return Children.toArray(nodes).map(enhance);
  };

  const renderedChildren = enhanceFirstControl(children);
   const translatedError = error ? t(error) : undefined; // <-- error is a key now

  return (
    <div>
      {label && (
        <label
          className="text-sm text-gray-700 block"
          htmlFor={firstControlId || `${id}-control`}
        >
          {label} {required && <span aria-hidden="true" className="text-red-600">*</span>}
        </label>
      )}

      <div className="mt-1">{renderedChildren}</div>

      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={errId} className="mt-1 text-xs text-red-600">
          {translatedError}
        </p>
      )}
    </div>
  );
}

export default Field;
