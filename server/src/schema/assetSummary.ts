import { z } from "zod";

const incomeSchema = z
  .object({
    id: z.string(),
    employer: z.string().optional(),
    owner: z.number().optional(),
    position: z.string().optional(),
    annualAmount: z.number().optional(),
  })
  .strict();

const cashAssetsSchema = z
  .object({
    id: z.string(),
    bank: z.string().optional(),
    accountNumber: z.string().optional(),
    owner: z.number().optional(),
    type: z
      .enum(["Checking", "Savings", "CD", "Money Market", "Other"])
      .optional(),
    interestRate: z.number().optional(),
    balance: z.number().optional(),
  })
  .strict();

const socialInsuranceSchema = z
  .object({
    id: z.string(),
    owner: z.number().optional(),
    monthlyAmount: z.number().optional(),
  })
  .strict();

const statementWealthSchema = z
  .object({
    id: z.string(),
    company: z.string().optional(),
    accountNumber: z.string().optional(),
    owner: z.number().optional(),
    type: z
      .enum([
        "401(k)",
        "Roth 401(k)",
        "IRA",
        "Rollover IRA",
        "Roth IRA",
        "457(b)",
      ])
      .optional(),
    managed: z.boolean().optional(),
    annualContribution: z.number().optional(),
    marketValue: z.number().optional(),
    qualified: z.boolean().optional(),
  })
  .strict();

const hardAssetsSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    type: z
      .enum(["Real Estate", "Business", "Collectibles", "Auto"])
      .optional(),
    owner: z.number().optional(),
    costBasis: z.number().optional(),
    netIncome: z.number().optional(),
    marketValue: z.number().optional(),
  })
  .strict();

const lifeInsuranceSchema = z
  .object({
    id: z.string(),
    company: z.string().optional(),
    policyNumber: z.string().optional(),
    insured: z.number().optional(),
    type: z.enum(["Term", "Group Term", "Whole", "GUL", "IUL"]).optional(),
    annualPremium: z.number().optional(),
    cashValue: z.number().optional(),
    deathBenefit: z.number().optional(),
  })
  .strict();

const longTermCareSchema = z
  .object({
    id: z.string(),
    company: z.string().optional(),
    policyNumber: z.string().optional(),
    insured: z.number().optional(),
    eliminationPeriod: z.string().optional(),
    COLA: z.number().optional(),
    annualPremium: z.number().optional(),
    monthlyBenefit: z.number().optional(),
    deathBenefit: z.number().optional(),
  })
  .strict();

const accumulationAnnuitySchema = z
  .object({
    id: z.string(),
    company: z.string().optional(),
    policyNumber: z.string().optional(),
    owner: z.number().optional(),
    taxStatus: z.string().optional(),
    type: z.string().optional(),
    surrenderFree: z.boolean().optional(),
    accountValue: z.number().optional(),
  })
  .strict();

const personalPensionAnnuitySchema = z
  .object({
    id: z.string(),
    company: z.string().optional(),
    policyNumber: z.string().optional(),
    owner: z.number().optional(),
    taxStatus: z.string().optional(),
    effectiveDate: z.string().optional(),
    annualIncome: z.number().optional(),
    accountValue: z.number().optional(),
  })
  .strict();

const pensionSchema = z
  .object({
    id: z.string(),
    company: z.string().optional(),
    accountNumber: z.string().optional(),
    owner: z.number().optional(),
    monthlyIncome: z.number().optional(),
    survivorBenefit: z.number().optional(),
  })
  .strict();

const debtsSchema = z
  .object({
    id: z.string(),
    lender: z.string().optional(),
    owner: z.number().optional(),
    type: z.enum(["HELOC", "Mortgage", "Auto Loan", "Credit Card"]).optional(),
    asset: z.string().optional(),
    accountNumber: z.string().optional(),
    interestRate: z.number().optional(),
    monthlyPayment: z.number().optional(),
    balance: z.number().optional(),
  })
  .strict();

const inheritanceSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    type: z
      .enum(["Cash", "Contractual Wealth", "Statement Wealth", "Hard Assets"])
      .optional(),
    amount: z.number().optional(),
  })
  .strict();

export const assetSummarySchema = z
  .object({
    income: z.array(incomeSchema).optional(),
    cashAssets: z.array(cashAssetsSchema).optional(),
    socialInsurance: z.array(socialInsuranceSchema).optional(),
    statementWealth: z.array(statementWealthSchema).optional(),
    hardAssets: z.array(hardAssetsSchema).optional(),
    lifeInsurance: z.array(lifeInsuranceSchema).optional(),
    longTermCare: z.array(longTermCareSchema).optional(),
    accumulationAnnuity: z.array(accumulationAnnuitySchema).optional(),
    personalPensionAnnuity: z.array(personalPensionAnnuitySchema).optional(),
    pension: z.array(pensionSchema).optional(),
    debts: z.array(debtsSchema).optional(),
    inheritance: z.array(inheritanceSchema).optional(),
  })
  .strict();

export const updateAssetSummarySchema = z.object({
  assetSummary: assetSummarySchema.optional(),
  people: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        birthday: z.string(),
      }),
    )
    .optional(),
});
