// Minimal localStorage helpers for form — single key: "ssp.form"

const STORAGE_KEY = "ssp.form";

/** Load saved form data (object) or null if nothing saved/parse fails. */
export function loadForm() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Save the entire form state as is */
export function saveForm(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
}

/** Remove the saved form. */
export function clearForm() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.log(err);
  }
}

/** Small debounce utility. */
export function debounce(fn, delay = 400) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
