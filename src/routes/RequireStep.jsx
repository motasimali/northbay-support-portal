import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { loadForm } from "../lib/storage";
import {
  isStep1Complete,
  isStep2Complete,
  isStep3Complete,
  firstIncompleteStep,
  stepToPath,
} from "../lib/stepCompletion";

// Pick whichever dataset (context vs localStorage) is farther along.
function getLatestSavedData(contextData, localStorageData) {
  const score = (data) => {
    let s = 0;
    if (isStep1Complete(data)) s = 1;
    if (isStep2Complete(data)) s = 2;
    if (isStep3Complete(data)) s = 3;
    return s;
  };
  // Handle null/undefined safely
  if (!contextData && !localStorageData) return {};
  if (!contextData) return localStorageData || {};
  if (!localStorageData) return contextData || {};
  return score(contextData) >= score(localStorageData) ? contextData : localStorageData;
}

/**
 * RequireStep
 * - minStep: 2 => require Step 1 complete
 * - minStep: 3 => require Steps 1–2 complete
 * - minStep: 4 => require Steps 1–3 complete
 */
export default function RequireStep({ minStep, children }) {
  const { data } = useFormContext();
  const location = useLocation();

  const contextData = data;
  const localStorageData = React.useMemo(() => loadForm(), []); // read once per mount
  const snapshot = React.useMemo(() => getLatestSavedData(contextData, localStorageData), [contextData, localStorageData]);

  const allowed =
    (minStep === 2 && isStep1Complete(snapshot)) ||
    (minStep === 3 && isStep1Complete(snapshot) && isStep2Complete(snapshot)) ||
    (minStep === 4 &&
      isStep1Complete(snapshot) &&
      isStep2Complete(snapshot) &&
      isStep3Complete(snapshot));

  if (!allowed) {
    const target = stepToPath(firstIncompleteStep(snapshot));
    return <Navigate to={target} replace state={{ from: location }} />;
  }

  return children;
}
