import { Field } from "../Field";
export function TextArea({ children, label, error, required, rows = 4, ...rest }) {
  return (
    <Field label={label} error={error} required={required}>
      <textarea rows={rows} className="w-full rounded-lg border px-3 py-2" {...rest} />
      {children}
    </Field>
  );
}
