import i18n from "../i18n";
const t = i18n.t.bind(i18n);

const trim = (s) => String(s ?? "").trim();

function isValidDateYYYYMMDD(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;

  const [y, m, d] = str.split("-").map(Number);

  const dt = new Date(Date.UTC(y, m - 1, d));

  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const min = new Date(Date.UTC(1900, 0, 1));

  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d &&
    dt >= min &&
    dt <= todayUTC
  );
}
function isPhoneE164ish(input) {
  const s = String(input ?? "").replace(/[\s()-]/g, "");
  return /^\+?[1-9]\d{7,14}$/.test(s);
}

// ---------- Step 1 ----------
export function validatePersonal(raw) {
  const v = {
    name: trim(raw?.name),
    nationalId: trim(raw?.nationalId),
    dob: String(raw?.dob ?? ""),
    gender: String(raw?.gender ?? ""),
    address: trim(raw?.address),
    city: trim(raw?.city),
    state: trim(raw?.state),
    country: trim(raw?.country),
    phone: String(raw?.phone ?? ""),
    email: trim(raw?.email),
  };

  const errors = {};
  if (v.name.length < 2) errors.name = t("errors.nameRequired");
  if (!/^[A-Za-z0-9-]{6,30}$/.test(v.nationalId)) errors.nationalId = t("errors.nationalIdInvalid");
  if (!isValidDateYYYYMMDD(v.dob)) errors.dob = t("errors.dobInvalid");
  if (!["male", "female", "other", "prefer_not"].includes(v.gender)) errors.gender = t("errors.genderRequired");
  if (v.address.length < 5) errors.address = t("errors.addressRequired");
  // if (v.address.length > 30) errors.address = t("errors.addressLong", {defaultValue: "Address must be less than 30 chars"});
  if (v.city.length < 2) errors.city = t("errors.cityRequired");
  if (v.state.length < 2) errors.state = t("errors.stateRequired");
  if (v.country.length < 2) errors.country = t("errors.countryRequired");
  if (!isPhoneE164ish(v.phone)) errors.phone = t("errors.phoneInvalid");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = t("errors.emailInvalid");

  return { valid: Object.keys(errors).length === 0, errors, values: v };
}

// ---------- Step 2 ----------
export const MARITAL = [
  "single",
  "married",
  "divorced",
  "widowed"
];
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

export function validateFamily(raw) {
  const v = {
    maritalStatus: String(raw?.maritalStatus ?? ""),
    dependents: Number(raw?.dependents ?? NaN),
    employmentStatus: String(raw?.employmentStatus ?? ""),
    income: raw?.income === "" || raw?.income == null ? NaN : Number(raw?.income),
    housingStatus: String(raw?.housingStatus ?? ""),
  };

  const errors = {};

  if (!MARITAL.includes(v.maritalStatus)) errors.maritalStatus = t("errors.maritalRequired");

  if (!Number.isInteger(v.dependents)) errors.dependents = t("errors.dependentsInt");
  else if (v.dependents < 0) errors.dependents = t("errors.dependentsMin");
  else if (v.dependents > 20) errors.dependents = t("errors.dependentsMax");

  if (!EMPLOYMENT.includes(v.employmentStatus)) errors.employmentStatus = t("errors.employmentRequired");

  if (!Number.isFinite(v.income)) errors.income = t("errors.incomeNumber");
  else if (v.income < 0) errors.income = t("errors.incomeNonNegative");
  else if (v.income > 1_000_0000) errors.income = t("errors.incomeMax");

  if (!HOUSING.includes(v.housingStatus)) errors.housingStatus = t("errors.housingRequired");

  return { valid: Object.keys(errors).length === 0, errors, values: v };
}

// ---------- Step 3 ----------
export function validateSituation(raw) {
  const v = {
    financial: trim(raw?.financial),
    employment: trim(raw?.employment),
    reason: trim(raw?.reason),
  };

  const errors = {};

  if (v.financial.length < 20) errors.financial = t("errors.descriptionMin");
  if (v.employment.length < 20) errors.employment = t("errors.descriptionMin");
  if (v.reason.length < 20) errors.reason = t("errors.descriptionMin");

  return { valid: Object.keys(errors).length === 0, errors, values: v };
}
