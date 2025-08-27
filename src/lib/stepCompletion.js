import {
  validatePersonal,
  validateFamily,
  validateSituation,
} from "../validation/validators";

export function isStep1Complete(data) {
  return validatePersonal(data?.personal).valid;
}
export function isStep2Complete(data) {
  return validateFamily(data?.family).valid;
}
export function isStep3Complete(data) {
  return validateSituation(data?.situation).valid;
}

export function firstIncompleteStep(data) {
  if (!isStep1Complete(data)) return 1;
  if (!isStep2Complete(data)) return 2;
  if (!isStep3Complete(data)) return 3;
  return 4; // all complete
}

export function stepToPath(stepNum) {
  switch (stepNum) {
    case 1:
      return "/step-1";
    case 2:
      return "/step-2";
    case 3:
      return "/step-3";
    case 4:
      return "/review";
    default:
      return "/step-1";
  }
}
