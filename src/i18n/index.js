import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const STORAGE_LANG_KEY = "ssp.lang";
const savedLang = localStorage.getItem(STORAGE_LANG_KEY);
const startLang = savedLang || "en";

const resources = {
  en: {
    common: {
      app: { title: "Social Support Portal" },
      steps: {
        personal: "Personal Info",
        family: "Family & Financial",
        situation: "Situation",
        review: "Review",
      },
      actions: {
        next: "Next",
        back: "Back",
        review: "Review",
        submit: "Submit",
        reset: "Reset",
      },
      fields: {
        // step 1
        name: "Name",
        nationalId: "National ID",
        dob: "Date of Birth",
        gender: "Gender",
        address: "Address",
        city: "City",
        state: "State",
        country: "Country",
        phone: "Phone",
        email: "Email",
        // step 2
        maritalStatus: "Marital Status",
        dependents: "Dependents",
        employmentStatus: "Employment Status",
        income: "Monthly Income (AED)",
        housingStatus: "Housing Status",
        // step 3
        financial: "Current Financial Situation",
        employment: "Employment Circumstances",
        reason: "Reason for Applying",
        descriptionHint: "At least 20 characters; include the essentials.",
      },
      options: {
        gender: {
          male: "Male",
          female: "Female",
          other: "Other",
          prefer_not: "Prefer not to say",
        },
        marital: {
          single: "Single",
          married: "Married",
          divorced: "Divorced",
          widowed: "Widowed",
        },
        employment: {
          employed: "Employed",
          unemployed: "Unemployed",
          self_employed: "Self-employed",
          student: "Student",
          retired: "Retired",
          homemaker: "Homemaker",
          other: "Other",
        },
        housing: {
          renting: "Renting",
          own_home: "Own home",
          with_family: "Living with family",
          employer_provided: "Employer-provided",
          temporary: "Temporary / Shelter",
          other: "Other",
        },
      },
      banners: {
        resumed:
          "Resumed your last saved progress. You can continue or click Reset to start over.",
      },
      placeholders: {
        // step 1
        name: "John Doe",
        nationalId: "A1234567",
        dob: "YYYY-MM-DD",
        gender: "Select gender",
        address: "123 Main St, Apt 4",
        city: "Dubai",
        state: "Dubai",
        country: "United Arab Emirates",
        phone: "+9715XXXXXXXX",
        email: "john@example.com",
        // step 2
        maritalStatus: "Select marital status",
        employmentStatus: "Select employment status",
        housingStatus: "Select housing status",
        dependents: "0",
        income: "12000",
        // step 3
        financial: "Describe your current financial situation…",
        employment: "Explain your employment status and circumstances…",
        reason: "Why are you applying for support? What will it help with?…",
      },
      errors: {
        // step 1
        nameRequired: "Please enter your full name",
        nationalIdInvalid:
          "Enter a valid National ID (letters, numbers, hyphens; 6–30 chars)",
        dobInvalid: "Enter a valid date (YYYY-MM-DD), not in the future",
        genderRequired: "Please select a gender option",
        addressRequired: "Please enter a full address",
        cityRequired: "Please enter a city",
        stateRequired: "Please enter a state",
        countryRequired: "Please enter a country",
        phoneInvalid:
          "Enter a valid phone in international format (e.g., +9715XXXXXXXX)",
        emailInvalid: "Enter a valid email address",
        // step 2
        maritalRequired: "Please select your marital status",
        employmentRequired: "Please select your employment status",
        housingRequired: "Please select your housing status",
        dependentsNumber: "Enter a number",
        dependentsInt: "Must be a whole number",
        dependentsMin: "Cannot be negative",
        dependentsMax: "Are you sure? 20+ not allowed here",
        incomeNumber: "Enter a number",
        incomeNonNegative: "Cannot be negative",
        incomeMax: "Too large",
        // step 3
        descriptionMin: "Please provide at least 20 characters",
      },
      // ---- Success page strings ----
      success: {
        title: "Application submitted",
        subtitle: "We've received your request.",
        cta: "Start a new application",
      },
      // AI modal text (tone already removed earlier)
      helpMeWriteTitle: "Help me write",
      yourNotes: "Your notes (min 10 chars)",
      notesPlaceholder: "Key facts, constraints, who’s impacted, timelines…",
      accept: "Accept",
      discard: "Discard",
      retry: "Retry",
      generate: "Generate",
      section: "Section",
      editSuggestion: "Edit suggestion",
      chars: "chars",
    },
  },
  ar: {
    common: {
      app: { title: "بوابة الدعم الاجتماعي" },
      steps: {
        personal: "المعلومات الشخصية",
        family: "الأسرة والمالية",
        situation: "الوضع",
        review: "مراجعة",
      },
      actions: {
        next: "التالي",
        back: "رجوع",
        review: "مراجعة",
        submit: "إرسال",
        reset: "إعادة ضبط",
      },
      fields: {
        name: "الاسم",
        nationalId: "الهوية الوطنية",
        dob: "تاريخ الميلاد",
        gender: "الجنس",
        address: "العنوان",
        city: "المدينة",
        state: "الولاية/الإمارة",
        country: "الدولة",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        maritalStatus: "الحالة الاجتماعية",
        dependents: "المعالون",
        employmentStatus: "الحالة الوظيفية",
        income: "الدخل الشهري (درهم)",
        housingStatus: "حالة السكن",
        financial: "الوضع المالي الحالي",
        employment: "الظروف الوظيفية",
        reason: "سبب التقديم",
        descriptionHint: "20 حرفًا على الأقل؛ اذكر الأساسيات.",
      },
      options: {
        gender: {
          male: "ذكر",
          female: "أنثى",
          other: "آخر",
          prefer_not: "أفضل عدم الإفصاح",
        },
        marital: {
          single: "أعزب",
          married: "متزوج",
          divorced: "مطلّق",
          widowed: "أرمل",
        },
        employment: {
          employed: "موظف",
          unemployed: "عاطل عن العمل",
          self_employed: "عمل حر",
          student: "طالب",
          retired: "متقاعد",
          homemaker: "رب/ربة منزل",
          other: "أخرى",
        },
        housing: {
          renting: "إيجار",
          own_home: "ملك",
          with_family: "مع الأسرة",
          employer_provided: "سكن من جهة العمل",
          temporary: "مؤقت/ملجأ",
          other: "أخرى",
        },
      },
      banners: {
        resumed:
          "تم استئناف التقدم المحفوظ. يمكنك المتابعة أو الضغط على إعادة ضبط للبدء من جديد.",
      },
      placeholders: {
        name: "محمد أحمد",
        nationalId: "A1234567",
        dob: "YYYY-MM-DD",
        gender: "اختر الجنس",
        address: "شارع رئيسي ١٢٣، شقة ٤",
        city: "دبي",
        state: "دبي",
        country: "الإمارات العربية المتحدة",
        phone: "+9715XXXXXXXX",
        email: "user@example.com",
        maritalStatus: "اختر الحالة الاجتماعية",
        employmentStatus: "اختر الحالة الوظيفية",
        housingStatus: "اختر حالة السكن",
        dependents: "0",
        income: "12000",
        financial: "صف وضعك المالي الحالي…",
        employment: "اشرح حالتك الوظيفية وظروف العمل…",
        reason: "لماذا تتقدم للحصول على الدعم؟ وكيف سيساعدك؟…",
      },
      errors: {
        nameRequired: "يرجى إدخال الاسم الكامل",
        nationalIdInvalid:
          "يرجى إدخال رقم هوية صحيح (أحرف/أرقام/شرطات؛ 6–30)",
        dobInvalid: "أدخل تاريخًا صحيحًا (YYYY-MM-DD) وليس في المستقبل",
        genderRequired: "يرجى اختيار الجنس",
        addressRequired: "يرجى إدخال العنوان الكامل",
        cityRequired: "يرجى إدخال المدينة",
        stateRequired: "يرجى إدخال الولاية/الإمارة",
        countryRequired: "يرجى إدخال الدولة",
        phoneInvalid:
          "أدخل رقم هاتف دولي بصيغة صحيحة (مثال: ‎+9715XXXXXXXX)",
        emailInvalid: "يرجى إدخال بريد إلكتروني صالح",
        maritalRequired: "يرجى اختيار الحالة الاجتماعية",
        employmentRequired: "يرجى اختيار الحالة الوظيفية",
        housingRequired: "يرجى اختيار حالة السكن",
        dependentsNumber: "يرجى إدخال رقم",
        dependentsInt: "يجب أن يكون عددًا صحيحًا",
        dependentsMin: "لا يمكن أن يكون سالبًا",
        dependentsMax: "غير مسموح بأكثر من 20",
        incomeNumber: "يرجى إدخال رقم",
        incomeNonNegative: "لا يمكن أن يكون سالبًا",
        incomeMax: "القيمة كبيرة جدًا",
        descriptionMin: "يرجى كتابة 20 حرفًا على الأقل",
      },
      // ---- Success page strings ----
      success: {
        title: "تم إرسال الطلب",
        subtitle: "لقد استلمنا طلبك.",
        cta: "ابدأ طلبًا جديدًا",
      },
      // Modal text (tone removed)
      helpMeWriteTitle: "ساعدني في الكتابة",
      yourNotes: "ملاحظاتك (10 أحرف على الأقل)",
      notesPlaceholder:
        "الحقائق الأساسية، القيود، المتأثرون، الجداول الزمنية…",
      accept: "اعتماد",
      discard: "تجاهل",
      retry: "إعادة المحاولة",
      generate: "إنشاء",
      section: "القسم",
      editSuggestion: "تحرير الاقتراح",
      chars: "حرفًا",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: startLang,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_LANG_KEY, lng);
  const dir = i18n.dir(lng);
  document.documentElement.setAttribute("dir", dir);
});
document.documentElement.setAttribute("dir", i18n.dir(startLang));

export default i18n;
export { STORAGE_LANG_KEY };
