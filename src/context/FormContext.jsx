// NOTE: Small project — we colocate Provider + Context + useFormContext here
// for simplicity. If the app grows, we can move useFormContext to src/hooks/ and
// re-export without breaking imports.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadForm, saveForm, clearForm, debounce } from "../lib/storage";

const FormContext = createContext(null);

const steps = [
  { id: 1, path: "/step-1", labelKey: "steps.personal" },
  { id: 2, path: "/step-2", labelKey: "steps.family" },
  { id: 3, path: "/step-3", labelKey: "steps.situation" },
];

const defaultData = {
  personal: {
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
  },
  family: {
    maritalStatus: "",
    dependents: 0,
    employmentStatus: "",
    income: "",
    housingStatus: "",
  },
  situation: { 
    financial: "",
    employment: "",
    reason: "" 
  },
};

export function FormProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [resumed, setResumed] = useState(false);

  const pageResetRef = useRef(null);

  useEffect(() => {
    const saved = loadForm();
    if (saved) {
      setData((d) => ({ ...d, ...saved }));
      setResumed(true);
    }
  }, []);

  const debouncedSaveRef = useRef(debounce(saveForm, 500));
  useEffect(() => {
    debouncedSaveRef.current(data);
  }, [data]);

  const registerPageReset = (fn) => {
    pageResetRef.current = typeof fn === "function" ? fn : null;
  };

  const reset = (navigate) => {
    clearForm();
    setData(defaultData);
    setResumed(false);
    try {
      pageResetRef.current?.();
    } catch (err) {
      console.log(err);
    }
    if (navigate) navigate("/step-1", { replace: true });
  };

  const value = useMemo(
    () => ({ data, setData, steps, reset, resumed, registerPageReset }),
    [data, resumed]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Come up with the better name for useFormContext because react-hook-form also has useFormContext
// eslint-disable-next-line react-refresh/only-export-components
export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used inside <FormProvider>");
  return ctx;
}
