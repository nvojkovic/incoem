export const newEmploymentIncome = (): EmploymentIncome => ({
  type: "employment-income",
  personId: 0,
  annualIncome: 10000,
  startAge: 20,
  firstYearProratePercent: 0.5,
  yearlyIncreasePercent: 0.1,
  retirementAgeYear: 65,
  retirementAgeMonth: 1,
});

export const newSocialSecurityIncome = (): SocialSecurityIncome => ({
  type: "social-security",
  personId: 0,
  annualAmount: 10000,
  cola: 0.02,
  alreadyReceiving: false,
});

export const newPensionIncome = (): CompanyPension => ({
  type: "company-pension",
  annualAmount: 10000,
  survivorPercent: 100,
  personId: 0,
  yearlyIncreasePercent: 5,
  firstYearProRatePercent: 100,
});

export const newIncome = (type: IncomeType): Income => {
  switch (type) {
    case "employment-income":
      return newEmploymentIncome();
    case "social-security":
      return newSocialSecurityIncome();
    case "company-pension":
      return newPensionIncome();
  }
};
