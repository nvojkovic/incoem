import {
  CalculatorSettings,
  StoredCalculator,
} from "./components/Calculators/Versatile/versatileTypes";
import { AssetSummary } from "./components/Nate/types";

export interface SelectedColumn {
  type:
  | "year"
  | "age"
  | "income"
  | "total"
  | "none"
  | "spending"
  | "gap"
  | "taxes"
  | "posttax"
  | "income-stability"
  | "spending-stability"
  | "0-alive"
  | "1-alive"
  | "joint-alive";
  id: number;
}

export interface Person {
  name: string;
  birthday: string;
  id: number;
  sex?: "Male" | "Female";
}

export interface IncomeMapData {
  people: Person[];
  incomes: Income[];
  version: 1;
}

export interface Income {
  id: number;
  personId: number;
  type: IncomeType;
  enabled: boolean;
  stable: boolean;
  taxType: TaxType;
}

export type IncomeType =
  | "employment-income"
  | "social-security"
  | "company-pension"
  | "annuity"
  | "other-income"
  | "paydown";

export type TaxType = "Taxable" | "Tax-Deferred" | "Tax-Free";

export interface MonthlyYearlyAmount {
  type: "monthly" | "yearly";
  value: number;
}

export interface EmploymentIncome extends Income {
  type: "employment-income";
  startAge: number;
  name: string;
  firstYearProratePercent: number;
  annualIncome: number;
  income: MonthlyYearlyAmount;
  yearlyIncreasePercent: number;
  yearlyIncrease: YearlyIncrease;
  retirementAgeYear: number;
  retirementAgeMonth: number;
  taxType: TaxType;
}

export interface SocialSecurityIncome extends Income {
  type: "social-security";
  name: string;
  calculationMethod: "manual" | "pia";
  pia: number;
  annualAmount: number;
  amount: MonthlyYearlyAmount;
  alreadyReceiving: boolean;
  cola: number;
  yearlyIncrease: YearlyIncrease;
  startAgeYear: number;
  startAgeMonth: number;
}

export interface CompanyPension extends Income {
  type: "company-pension";
  name: string;
  personId: number;
  annualAmount: number;
  amount: MonthlyYearlyAmount;
  survivorPercent: number;
  yearlyIncreasePercent: number;
  yearlyIncrease: YearlyIncrease;
  startAge?: number | null;
  firstYearProRatePercent: number;
  taxType: TaxType;
}

export interface BasicAnnuity extends Income {
  type: "annuity";
  name: string;
  personId: number;
  annualAmount: number;
  amount: MonthlyYearlyAmount;
  yearsOfDeferral: number;
  yearlyIncreasePercent: number;
  yearlyIncrease: YearlyIncrease;
  survivorPercent: number;
  firstYearProRatePercent: number;
  taxType: TaxType;
}

export interface OtherIncome extends Income {
  type: "other-income";
  name: string;
  personId: number;
  amount: number;
  newAmount: MonthlyYearlyAmount;
  frequency: "monthly" | "quarterly" | "semi-annually" | "annually";
  startYear: number;
  endYear: number;
  yearlyIncreasePercent: number;
  yearlyIncrease: YearlyIncrease;
  survivorPercent: number;
  firstYearProRatePercent: number;
  taxType: TaxType;
}

export interface Paydown extends Income {
  type: "paydown";
  name: string;
  personId: number;
  total: number;
  paymentInYear: "beginning" | "end";
  startYear: number;
  length: number;
  interestRate: number;
  taxType: TaxType;
}

export interface Client {
  title: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  people: Person[];
  incomes: Income[];
  spending: RetirementSpendingSettings;
  scenarios: ScenarioSettings[];
  stabilityRatioFlag: boolean;
  needsFlag: boolean;
  taxesFlag: boolean;
  longevityFlag: boolean;
  allInOneCalculator: any[];
  versatileCalculator: CalculatorSettings;
  versatileCalculators: StoredCalculator[];
  liveSettings: ScenarioSettings;
  reportSettings: ReportSettings;
  assetSummary: AssetSummary;
}

export type PrintClient = Client & {
  userdata: UserInfo;
};

export interface User {
  info?: UserInfo;
  createdAt: number;
  intercomHash: string;
  userId: string;
  // Add other user properties as needed
}

export interface UserInfo {
  firmName: string;
  disclosures: string;
  subsciptionStatus?: string;
  stabilityRatioFlag: boolean;
  needsFlag: boolean;
  longevityFlag: boolean;
  taxesFlag: boolean;
  logo?: string | null;
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

export interface SavedScenario {
  id: number;
  name: string;
  deathYears: (number | null)[];
  ssSurvivorAge: (number | null)[];
  inflation: number;
  longevityPercent: number;
  retirementYear?: number;
  whoDies: number;
  people: Person[];
  incomes: Income[];
}

export interface LiveSettings {
  maxYearsShown: number;
  mapType: "result" | "composite";
  monthlyYearly: "monthly" | "yearly";
  chartType: "income" | "spending";
  taxType: "Pre-Tax" | "Post-Tax";
  inflationType: "Real" | "Nominal";
  showTaxType: boolean;
}

export type ScenarioSettings = SavedScenario & LiveSettings;

export type YearlyIncrease =
  | { type: "general" }
  | { type: "none" }
  | { type: "custom"; percent: number };

export interface SpendingResult {
  type: "base" | "pre" | "post";
  category?: string;
  amount: number;
}

export interface RetirementSpendingSettings {
  currentSpending: number;
  newCurrentSpending: MonthlyYearlyAmount;
  yearlyIncrease: YearlyIncrease;
  decreaseAtDeath: [number, number];
  preTaxRate: number;
  postTaxRate: number;
  preSpending: CurrentSpending[];
  postSpending: NewSpending[];
}

export interface CurrentSpending {
  category: string;
  amount: number;
  newAmount: MonthlyYearlyAmount;
  endYear: number;
  increase: YearlyIncrease;
}

export interface NewSpending {
  category: string;
  amount: number;
  newAmount: MonthlyYearlyAmount;
  startYear: number;
  endYear: number;
  increase: YearlyIncrease;
  changeAtDeath: [number, number];
}

export interface CoverPage {
  id: string;
  name: "cover";
  settings: object;
}

export interface IncomesPage {
  id: string;
  name: "incomes";
  settings: object;
}

export interface IncomeChartPage {
  id: string;
  name: "income-chart";
  settings: object;
}

export interface SpendingPage {
  id: string;
  name: "spending";
  settings: object;
}

export interface SpendingChartPage {
  id: string;
  name: "spending-chart";
  settings: object;
}

export interface LongevityPage {
  id: string;
  name: "longevity";
  settings: object;
}

export type ReportPage =
  | CoverPage
  | IncomesPage
  | IncomeChartPage
  | SpendingPage
  | SpendingChartPage
  | LongevityPage;

export type ReportSettings = ReportPage[];
