import { Field } from "../Field";
export function SelectInput({ label, error, required, children, ...rest }) {
  return (
    <Field label={label} error={error} required={required}>
      <select className="w-full rounded-lg border px-3 py-2" {...rest}>
        {children}
      </select>
    </Field>
  );
}
