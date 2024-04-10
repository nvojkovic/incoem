const id = () => Math.floor(Math.random() * 1000000);
export const newEmploymentIncome = (): any => ({
  id: id(),
  enabled: true,
  type: "employment-income",
  personId: 0,
  annualIncome: null,
  startAge: null,
  firstYearProratePercent: null,
  yearlyIncreasePercent: null,
  retirementAgeYear: null,
  retirementAgeMonth: null,
});

export const newSocialSecurityIncome = (): SocialSecurityIncome => ({
  id: id(),
  enabled: true,
  type: "social-security",
  personId: 0,
  annualAmount: 0,
  cola: 0,
  alreadyReceiving: false,
  pia: 0,
  calculationMethod: "pia",
  startAgeYear: null as any,
  startAgeMonth: null as any,
});

export const newPensionIncome = (): any => ({
  id: id(),
  enabled: true,
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
  id: id(),
  enabled: true,
  type: "annuity",
  name: "",
  personId: 0,
  annualAmount: null,
  yearsOfDeferral: 0,
  yearlyIncreasePercent: null,
  survivorPercent: null,
  firstYearProRatePercent: 100,
});

export const otherIncome = (): any => ({
  id: id(),
  enabled: true,
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
  id: id(),
  enabled: true,
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
    case "annuity":
      return newBasicAnnuity();
    case "other-income":
      return otherIncome();
    case "paydown":
      return paydown();
  }
  return undefined as any;
};
