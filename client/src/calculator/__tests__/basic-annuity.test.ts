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
    amount: { type: "monthly", value: 1000 },
    yearsOfDeferral: 0,
    survivorPercent: 100,
    firstYearProRatePercent: 100,
    yearlyIncrease: { type: "none" },
  } as any;

  const baseInfo: CalculationInfo<BasicAnnuity> = {
    income: baseIncome,
    startYear: 2023,
    currentYear: 2023,
    inflation: 0,
    deathYears: [0, 0],
    ssSurvivorAge: [null],
    people: [
      {
        id: 0,
        name: "John",
        birthday: "1970-01-01",
      },
      {
        id: 0,
        name: "Jane",
        birthday: "1975-01-01",
      },
    ],
    incomes: [baseIncome],
    inflationType: "Nominal",
    dead: -1,
  };

  it("should calculate basic monthly amount converted to annual", () => {
    const result = calculateBasicAnnuity(baseInfo);
    expect(result.amount).toBe(12000);
  });

  it("should handle deferred start", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, yearsOfDeferral: 2 },
    };

    // Before start
    expect(calculateBasicAnnuity({ ...info, currentYear: 2024 }).amount).toBe(
      0,
    );

    // After start
    expect(calculateBasicAnnuity({ ...info, currentYear: 2025 }).amount).toBe(
      12000,
    );
  });

  it("should apply inflation adjustment", () => {
    const info = {
      ...baseInfo,
      inflation: 20, // 3% inflation
      currentYear: 2024,
      inflationType: "Real",
    };

    const result = calculateBasicAnnuity(info);
    expect(result.amount).toBe(10000);
  });

  it("should apply survivor benefit reduction", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, survivorPercent: 50 },
      deathYears: [35],
      currentYear: 2024,
      dead: 0,
    };

    const result = calculateBasicAnnuity(info);
    expect(result.amount).toBe(6000); // 12000 * 0.5
  });

  it("should apply first year pro-rate", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, firstYearProRatePercent: 50 },
    };

    const result = calculateBasicAnnuity(info);
    expect(result.amount).toBe(6000); // 12000 * 0.5
  });
});
