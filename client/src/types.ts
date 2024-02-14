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

type IncomeType =
  | "employment-income"
  | "social-security"
  | "company-pension"
  | "basic-annuity"
  | "other-income"
  | "paydown";

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
  name: string;
  personId: number;
  annualAmount: number;
  survivorPercent: number;
  yearlyIncreasePercent: number;
  startAge?: number | null;
  firstYearProRatePercent: number;
}

interface BasicAnnuity extends Income {
  type: "basic-annuity";
  name: string;
  personId: number;
  annualAmount: number;
  yearsOfDeferral: number;
  yearlyIncreasePercent: number;
  survivorPercent: number;
  firstYearProRatePercent: number;
}

interface OtherIncome extends Income {
  type: "other-income";
  name: string;
  personId: number;
  amount: number;
  frequency: "monthly" | "quarterly" | "semi-annually" | "annually";
  startYear: number;
  endYear: number;
  yearlyIncreasePercent: number;
  survivorPercent: number;
  firstYearProRatePercent: number;
}

interface Paydown extends Income {
  type: "paydown";
  name: string;
  personId: number;
  total: number;
  paymentInYear: "beggining" | "end";
  startYear: number;
  length: number;
  interestRate: number;
}

interface CalculationInfo<T extends Income> {
  people: Person[];
  inflation?: number;
  income: T;
  startYear: number;
  currentYear: number;
  deathYears: number[];
  dead: number;
}
