import { Income, IncomeType, Person, SocialSecurityIncome } from "./types";

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
  yearlyIncrease: { type: "general" },
  retirementAgeYear: null,
  retirementAgeMonth: null,
  taxType: "Taxable",
});

export const newSocialSecurityIncome = (
  person: Person,
): SocialSecurityIncome => ({
  id: id(),
  enabled: true,
  name: "",
  type: "social-security",
  personId: person.id,
  stable: true,
  annualAmount: 0,
  amount: { type: "yearly", value: null as any },
  cola: 0,
  yearlyIncrease: { type: "general" },
  alreadyReceiving: false,
  pia: 0,
  calculationMethod: "pia",
  startAgeYear: null as any,
  startAgeMonth: null as any,
  taxType: "Taxable",
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
  yearlyIncrease: { type: "none" },
  firstYearProRatePercent: 100,
  startAge: null,
  taxType: "Taxable",
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
  yearlyIncrease: { type: "none" },
  survivorPercent: null,
  firstYearProRatePercent: 100,
  taxType: "Taxable",
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
  yearlyIncrease: { type: "general" },
  survivorPercent: 100,
  firstYearProRatePercent: 100,
  name: "",
  taxType: "Taxable",
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
  taxType: "Taxable",
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
