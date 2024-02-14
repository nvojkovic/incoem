export const newEmploymentIncome = (): any => ({
  type: "employment-income",
  personId: 0,
  annualIncome: 0,
  startAge: null,
  firstYearProratePercent: 100,
  yearlyIncreasePercent: null,
  retirementAgeYear: null,
  retirementAgeMonth: 12,
});

export const newSocialSecurityIncome = (): SocialSecurityIncome => ({
  type: "social-security",
  personId: 0,
  annualAmount: 0,
  cola: 0,
  alreadyReceiving: false,
});

export const newPensionIncome = (): any => ({
  type: "company-pension",
  name: "",
  annualAmount: null,
  survivorPercent: 100,
  personId: 0,
  yearlyIncreasePercent: null,
  firstYearProRatePercent: 100,
  startAge: null,
});

export const newBasicAnnuity = (): any => ({
  type: "basic-annuity",
  name: "",
  personId: 0,
  annualAmount: null,
  yearsOfDeferral: 0,
  yearlyIncreasePercent: null,
  survivorPercent: null,
  firstYearProRatePercent: 100,
});

export const otherIncome = (): any => ({
  type: "other-income",
  personId: 0,
  startYear: null,
  amount: null,
  endYear: null,
  frequency: "annually",
  yearlyIncreasePercent: null,
  survivorPercent: 100,
  firstYearProRatePercent: 100,
  name: "",
});

export const paydown = (): any => ({
  type: "paydown",
  personId: 0,
  name: "",
  startYear: null,
  length: null,
  paymentInYear: null,
  interestRate: null,
  total: null,
});

export const newIncome = (type: IncomeType): Income => {
  switch (type) {
    case "employment-income":
      return newEmploymentIncome();
    case "social-security":
      return newSocialSecurityIncome();
    case "company-pension":
      return newPensionIncome();
    case "basic-annuity":
      return newBasicAnnuity();
    case "other-income":
      return otherIncome();
    case "paydown":
      return paydown();
  }
  return undefined as any;
};
