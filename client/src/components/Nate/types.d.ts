export interface Income {
  id: string;
  employer: string;
  owner: id;
  position: string;
  annualAmount: number;
}

export interface CashAsset {
  id: string;
  bank: string;
  accountNumber: string;
  owner: id;
  type: "Checking" | "Savings" | "CD" | "Money Market" | "Other";
  interestRate: number;
  balance: number;
}

export interface SocialInsurance {
  id: string;
  owner: id;
  monthlyAmount: number;
}

export interface StatementWealth {
  id: string;
  company: string;
  accountNumber: string;
  owner: id;
  type:
    | "401(k)"
    | "Roth 401(k)"
    | "IRA"
    | "Rollover IRA"
    | "Roth IRA"
    | "457(b)";
  managed: boolean;
  annualContribution: number;
  marketValue: number;
  qualified: boolean;
}

export interface HardAsset {
  id: string;
  name: string;
  type: "Real Estate" | "Business" | "Collectibles" | "Auto";
  owner: id;
  costBasis: number;
  netIncome: number;
  debt: number;
  marketValue: number;
}

export interface Debt {
  id: string;
  lender: string;
  owner: id;
  type: "HELOC" | "Mortgage" | "Auto Loan" | "Credit Card";
  asset: string;
  accountNumber: string;
  interestRate: number;
  monthlyPayment: number;
  balance: number;
}

export interface Inheritance {
  id: string;
  name: string;
  type: "Cash" | "Contractual Wealth" | "Statement Wealth" | "Hard Assets";
  amount: number;
}

export interface LifeInsurance {
  id: string;
  company: string;
  policyNumber: string;
  insured: number;
  type: "Term" | "Group Term" | "Whole" | "GUL" | "IUL";
  annualPremium: number;
  cashValue: number;
  deathBenefit: number;
}

export interface LongTermCare {
  id: string;
  company: string;
  policyNumber: string;
  insured: number;
  eliminationPeriod: string;
  COLA: number;
  annualPremium: number;
  monthlyBenefit: number;
  deathBenefit: number;
}

export interface PersonalPensionAnnuity {
  id: string;
  company: string;
  policyNumber: string;
  owner: id;
  taxStatus: string;
  effectiveDate: string;
  annualIncome: number;
  accountValue: number;
}
export interface AccumulationAnnuity {
  id: string;
  company: string;
  policyNumber: string;
  owner: id;
  taxStatus: string;
  type: string;
  surrenderFree: boolean;
  accountValue: number;
}

export interface Pension {
  id: string;
  company: string;
  accountNumber: string;
  owner: id;
  monthlyIncome: number;
  survivorBenefit: number;
}

export interface NateClient {
  income: Income[];
  cashAssets: CashAsset[];
  socialInsurance: SocialInsurance[];
  statementWealth: StatementWealth[];
  hardAssets: HardAsset[];
  lifeInsurance: LifeInsurance[];
  longTermCare: LongTermCare[];
  accumulationAnnuity: AccumulationAnnuity[];
  personalPensionAnnuity: PersonalPensionAnnuity[];
  pension: Pension[];
  debts: Debt[];
  inheritance: Inheritance[];
}
