// src/components/Field.jsx
import { useId, isValidElement, cloneElement, Children } from "react";

export function Field({ label, hint, error, children, inputId }) {
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

  return (
    <div>
      {label && (
        <label
          className="text-sm text-gray-700 block"
          htmlFor={firstControlId || `${id}-control`}
        >
          {label}
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
          {error}
        </p>
      )}
    </div>
  );
}

export default Field;
