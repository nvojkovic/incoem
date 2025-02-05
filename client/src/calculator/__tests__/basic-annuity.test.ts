import { calculateBasicAnnuity } from "../basic-annuity";
import { BasicAnnuity } from "src/types";
import { CalculationInfo } from "../types";

describe("Basic Annuity Calculator", () => {
  const baseIncome: BasicAnnuity = {
    id: 1,
    personId: 0,
    type: "annuity",
    enabled: true,
    stable: true,
    amount: { type: "monthly", value: 1000 }, // $1000/month
    yearsOfDeferral: 0,
    survivorPercent: 100,
    firstYearProRatePercent: 100,
    yearlyIncrease: { type: "none" }
  };

  const baseInfo: CalculationInfo<BasicAnnuity> = {
    income: baseIncome,
    startYear: 2023,
    currentYear: 2023,
    inflation: 0,
    deathYears: [null],
    ssSurvivorAge: [null]
  };

  it("should calculate basic monthly amount converted to annual", () => {
    const result = calculateBasicAnnuity(baseInfo);
    expect(result.amount).toBe(12000); // $1000 * 12
  });

  it("should handle deferred start", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, yearsOfDeferral: 2 }
    };
    
    // Before start
    expect(calculateBasicAnnuity({...info, currentYear: 2024}).amount).toBe(0);
    
    // After start
    expect(calculateBasicAnnuity({...info, currentYear: 2025}).amount).toBe(12000);
  });

  it("should apply inflation adjustment", () => {
    const info = {
      ...baseInfo,
      inflation: 0.03, // 3% inflation
      currentYear: 2024
    };
    
    const result = calculateBasicAnnuity(info);
    expect(result.amount).toBe(12360); // 12000 * 1.03
  });

  it("should apply survivor benefit reduction", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, survivorPercent: 50 },
      deathYears: [2023] // Person 0 died in 2023
    };
    
    const result = calculateBasicAnnuity(info);
    expect(result.amount).toBe(6000); // 12000 * 0.5
  });

  it("should apply first year pro-rate", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, firstYearProRatePercent: 50 }
    };
    
    const result = calculateBasicAnnuity(info);
    expect(result.amount).toBe(6000); // 12000 * 0.5
  });
});
