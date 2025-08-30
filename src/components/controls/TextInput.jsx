import { Field } from "../Field";
export function TextInput({ label, error, required, ...rest }) {
  return (
    <Field label={label} error={error} required={required}>
      <input className="w-full rounded-lg border px-3 py-2" {...rest} />
    </Field>
  );
}
