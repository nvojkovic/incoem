const id = () => Math.floor(Math.random() * 1000000);
export const newEmploymentIncome = (): any => ({
  id: id(),
  stable: false,
  enabled: true,
  type: "employment-income",
  personId: 0,
  annualIncome: null,
  startAge: null,
  firstYearProratePercent: 100,
  yearlyIncreasePercent: null,
  retirementAgeYear: null,
  retirementAgeMonth: null,
});

export const newSocialSecurityIncome = (
  person: Person,
): SocialSecurityIncome => ({
  id: id(),
  enabled: true,
  type: "social-security",
  personId: person.id,
  stable: true,
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
  stable: true,
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
  stable: true,
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
  stable: false,
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
  stable: false,
  startYear: null,
  length: null,
  paymentInYear: "beginning",
  interestRate: null,
  total: null,
});

export const newIncome = (type: IncomeType, person: Person): Income => {
  switch (type) {
    case "employment-income":
      return newEmploymentIncome();
    case "social-security":
      return newSocialSecurityIncome(person);
    case "company-pension":
      return newPensionIncome();
    case "annuity":
      return newBasicAnnuity();
    case "other-income":
      return otherIncome();
    case "paydown":
      return paydown();
  }
};
