/* eslint-env jest */
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

const g = globalThis;

if (!g.TextEncoder) g.TextEncoder = TextEncoder;
if (!g.TextDecoder) g.TextDecoder = TextDecoder;

// Lightweight i18n mock so labels render as English strings
jest.mock("react-i18next", () => {
  const map = {
    "steps.personal": "Personal Info",
    "actions.next": "Next",
    // Field labels used in Step 1
    "fields.name": "Name",
    "fields.nationalId": "National ID",
    "fields.dob": "Date of Birth",
    "fields.gender": "Gender",
    "fields.address": "Address",
    "fields.city": "City",
    "fields.state": "State",
    "fields.country": "Country",
    "fields.phone": "Phone",
    "fields.email": "Email",
    "placeholders.gender": "Select gender",
    "options.gender.male": "Male",
    "options.gender.female": "Female",
    "options.gender.other": "Other",
    "options.gender.prefer_not": "Prefer not to say",
  };
  return {
    useTranslation: () => ({
      t: (k, o) => map[k] ?? o?.defaultValue ?? k,
      i18n: { language: "en" },
    }),
    Trans: ({ children }) => children,
    initReactI18next: { type: "3rdParty", init: () => {} },
  };
});
