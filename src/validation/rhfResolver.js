// expected per-field error shape
// {
//   [fieldName]: {
//     type: string;        REQUIRED
//     message?: string;    what you show in UI
//   }
// }

export const makeResolver = (validateFn) => async (values) => {
  const { valid, errors, values: parsed } = validateFn(values);

  const rhfErrors = Object.fromEntries(
    Object.entries(errors).map(([name, message]) => [
      name,
      { type: "custom", message },
    ])
  );
  
  return { values: valid ? parsed : {}, errors: rhfErrors };
};
