export default {
  translation: {
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
      yourNotes: "Your notes (min 20 chars)",
      notesPlaceholder: "Key facts, constraints, who’s impacted, timelines…",
      accept: "Accept",
      discard: "Discard",
      retry: "Retry",
      generate: "Generate",
      section: "Section",
      editSuggestion: "Edit suggestion",
      chars: "chars",
  },
};
