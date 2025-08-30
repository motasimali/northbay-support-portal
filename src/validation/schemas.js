import { z } from "zod";
const trimStr = z.string().trim();

function isValidDateStringYYYYMMDD(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;

  const [y, m, d] = str.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));

  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  )
    return false;
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const min = new Date(Date.UTC(1900, 0, 1));
  return dt >= min && dt <= todayUTC;
}
function isValidPhoneE164ish(input) {
  if (!input) return false;
  const s = String(input).replace(/[\s()-]/g, "");
  return /^\+?[1-9]\d{7,14}$/.test(s);
}

// ---------- personal ----------
export const personalSchema = z.object({
  name: trimStr.min(2, "errors.nameRequired"),
  nationalId: trimStr
    .min(6, "errors.nationalIdInvalid")
    .max(30, "errors.nationalIdInvalid")
    .regex(/^[A-Za-z0-9-]+$/, "errors.nationalIdInvalid"),
  dob: z.string().refine(isValidDateStringYYYYMMDD, "errors.dobInvalid"),
  gender: z.enum(["male", "female", "other", "prefer_not"], {
    errorMap: () => ({ message: "errors.genderRequired" }),
  }),
  address: trimStr.min(5, "errors.addressRequired"),
  city: trimStr.min(2, "errors.cityRequired"),
  state: trimStr.min(2, "errors.stateRequired"),
  country: trimStr.min(2, "errors.countryRequired"),
  phone: z.string().refine(isValidPhoneE164ish, "errors.phoneInvalid"),
  email: trimStr.email("errors.emailInvalid"),
});

// ---------- step 2 (family/financial) ----------
export const MARITAL = ["single", "married", "divorced", "widowed"];
export const EMPLOYMENT = [
  "employed",
  "unemployed",
  "self_employed",
  "student",
  "retired",
  "homemaker",
  "other",
];
export const HOUSING = [
  "renting",
  "own_home",
  "with_family",
  "employer_provided",
  "temporary",
  "other",
];

export const familySchema = z.object({
  maritalStatus: z.enum(MARITAL, {
    errorMap: () => ({ message: "errors.maritalRequired" }),
  }),
  dependents: z
    .number({ message: "errors.dependentsNumber" })
    .int("errors.dependentsInt")
    .min(0, "errors.dependentsMin")
    .max(20, "errors.dependentsMax"),
  employmentStatus: z.enum(EMPLOYMENT, {
    errorMap: () => ({ message: "errors.employmentRequired" }),
  }),
  income: z
    .number({ message: "errors.incomeNumber" })
    .nonnegative("errors.incomeNonNegative")
    .max(1_000_000, "errors.incomeMax"),
  housingStatus: z.enum(HOUSING, {
    errorMap: () => ({ message: "errors.housingRequired" }),
  }),
});

// ---------- step 3 ----------
export const situationSchema = z.object({
  financial: trimStr.min(20, "errors.descriptionMin"),
  employment: trimStr.min(20, "errors.descriptionMin"),
  reason: trimStr.min(20, "errors.descriptionMin"),
});

// ---------- combined ----------
export const combinedSchema = z.object({
  personal: personalSchema,
  family: familySchema,
  situation: situationSchema,
});
