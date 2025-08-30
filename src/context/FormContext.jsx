import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadForm, saveForm, clearForm, debounce } from "../lib/storage";

// eslint-disable-next-line react-refresh/only-export-components
export const FormContext = createContext(null);

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
    reason: "",
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

  useEffect(() => {
    const flush = () => {
      saveForm(data);
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
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

