import { personalSchema, familySchema, situationSchema } from "../validation/schemas";

export function isStep1Complete(data) {
  return !!personalSchema.safeParse(data?.personal).success;
}
export function isStep2Complete(data) {
  return !!familySchema.safeParse(data?.family).success;
}
export function isStep3Complete(data) {
  return !!situationSchema.safeParse(data?.situation).success;
}

export function firstIncompleteStep(data) {
  if (!isStep1Complete(data)) return 1;
  if (!isStep2Complete(data)) return 2;
  if (!isStep3Complete(data)) return 3;
  return 4; // all complete
}

const STEP_TO_PATH = {
  1: "/step-1",
  2: "/step-2",
  3: "/step-3",
  4: "/review",
};
export function stepToPath(stepIndex) {
  return STEP_TO_PATH[stepIndex] || "/step-1";
}
export { STEP_TO_PATH };
