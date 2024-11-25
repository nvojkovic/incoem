interface SelectedColumn {
  type: "year" | "age" | "income" | "total" | "none";
  id: number;
}

interface Person {
  name: string;
  birthday: string;
  id: number;
  sex?: "Male" | "Female";
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
  yearlyIncrease: YearlyIncrease;
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
  yearlyIncrease: YearlyIncrease;
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
  yearlyIncrease: YearlyIncrease;
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
  yearlyIncrease: YearlyIncrease;
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
  yearlyIncrease: YearlyIncrease;
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
  inflationType: string;
  ssSurvivorAge: (number | null)[];
  dead: number;
}

interface Client {
  title: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  data: IncomeMapData;
  spending: RetirementSpendingSettings;
  scenarios: ScenarioSettings[];
  calculators: any;
  stabilityRatioFlag: boolean;
  needsFlag: boolean;
  longevityFlag: boolean;
  allInOneCalculator: any[];
  versatileCalculator: any;
  liveSettings: ScenarioSettings;
  reportSettings: ReportSettings;
}
type PrintClient = Client & {
  userdata: UserInfo;
};

interface User {
  info?: UserInfo;
  createdAt: number;
  intercomHash: string;
  userId: string;
  // Add other user properties as needed
}

interface UserInfo {
  firmName: string;
  disclosures: string;
  subsciptionStatus?: string;
  stabilityRatioFlag: boolean;
  needsFlag: boolean;
  longevityFlag: boolean;
  logo?: string;
  email: string;
  name?: string;
  primaryColor: string;
  globalInflation: number;
  globalYearsShown: number;
  globalLifeExpectancy: number;
  globalPreRetirementTaxRate: number;
  globalPostRetirementTaxRate: number;
  globalReportSettings: ReportSettings;
}

interface ScenarioSettings {
  id: number;
  name: string;
  maxYearsShown: number;
  deathYears: (number | null)[];
  ssSurvivorAge: (number | null)[];
  inflation: number;
  taxType: "Pre-Tax" | "Post-Tax";
  longevityPercent: number;
  inflationType: "Real" | "Nominal";
  retirementYear?: number;
  whoDies: number;
  data: IncomeMapData;
}

type YearlyIncrease =
  | { type: "general" }
  | { type: "none" }
  | { type: "custom"; percent: number };

interface RetirementSpendingSettings {
  currentSpending: number;
  yearlyIncrease: YearlyIncrease;
  decreaseAtDeath: [number, number];
  preTaxRate: number;
  postTaxRate: number;
  preSpending: CurrentSpending[];
  postSpending: NewSpending[];
}

interface CurrentSpending {
  category: string;
  amount: number;
  endYear: number;
  increase: YearlyIncrease;
}

interface NewSpending {
  category: string;
  amount: number;
  startYear: number;
  endYear: number;
  increase: YearlyIncrease;
  changeAtDeath: [number, number];
}

interface CoverPage {
  id: string;
  name: "cover";
  settings: {};
}

interface IncomesPage {
  id: string;
  name: "incomes";
  settings: {};
}

interface IncomeChartPage {
  id: string;
  name: "income-chart";
  settings: {};
}

interface SpendingPage {
  id: string;
  name: "spending";
  settings: {};
}

interface LongevityPage {
  id: string;
  name: "longevity";
  settings: {};
}

type ReportPage =
  | CoverPage
  | IncomesPage
  | IncomeChartPage
  | SpendingPage
  | LongevityPage;

type ReportSettings = ReportPage[];
