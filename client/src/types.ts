interface Person {
  name: string;
  birthYear: number;
  birthMonth: string;
  id: number;
}
interface IncomeMapData {
  people: Person[];
  incomes: Income[];
  version: 1;
}

interface Income {
  personId: number;
  type: IncomeType;
}

type IncomeType = "employment-income" | "social-security" | "company-pension";

interface EmploymentIncome extends Income {
  type: "employment-income";
  startAge: number;
  firstYearProratePercent: number;
  annualIncome: number;
  yearlyIncreasePercent: number;
  retirementAgeYear: number;
  retirementAgeMonth: number;
}

interface SocialSecurityIncome extends Income {
  type: "social-security";
  annualAmount: number;
  alreadyReceiving: boolean;
  cola: number;
  startOptions?: SocialSecurityStart;
}

interface SocialSecurityStart {
  startAgeYear: number;
  startAgeMonth: number;
}

interface CompanyPension extends Income {
  type: "company-pension";
  personId: number;
  annualAmount: number;
  survivorPercent: number;
  yearlyIncreasePercent: number;
  startAge?: number;
  firstYearProRatePercent: number;
}
