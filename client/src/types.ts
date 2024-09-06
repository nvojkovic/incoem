interface SelectedColumn {
  type: "year" | "age" | "income" | "total" | "none";
  id: number;
}

interface Person {
  name: string;
  birthday: string;
  id: number;
}
interface IncomeMapData {
  people: Person[];
  incomes: Income[];
  version: 1;
}

interface Income {
  id: number;
  personId: number;
  type: IncomeType;
  enabled: boolean;
  stable: boolean;
}

type IncomeType =
  | "employment-income"
  | "social-security"
  | "company-pension"
  | "annuity"
  | "other-income"
  | "paydown";

interface EmploymentIncome extends Income {
  type: "employment-income";
  startAge: number;
  name: string;
  firstYearProratePercent: number;
  annualIncome: number;
  yearlyIncreasePercent: number;
  retirementAgeYear: number;
  retirementAgeMonth: number;
}

interface SocialSecurityIncome extends Income {
  type: "social-security";
  calculationMethod: "manual" | "pia";
  pia: number;
  annualAmount: number;
  alreadyReceiving: boolean;
  cola: number;
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
  type: "annuity";
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
  paymentInYear: "beginning" | "end";
  startYear: number;
  length: number;
  interestRate: number;
}

interface CalculationInfo<T extends Income> {
  people: Person[];
  incomes: Income[];
  inflation?: number;
  income: T;
  startYear: number;
  currentYear: number;
  deathYears: number[];
  ssSurvivorAge: (number | null)[];
  dead: number;
}

interface Client {
  title: string;
  createdAt: string;
  id: number;
  data: IncomeMapData;
  scenarios: ScenarioSettings[];
}

interface ScenarioSettings {
  id: number;
  name: string;
  maxYearsShown: number;
  deathYears: (number | null)[];
  ssSurvivorAge: (number | null)[];
  inflation: number;
  whoDies: number;
  data: IncomeMapData;
}
