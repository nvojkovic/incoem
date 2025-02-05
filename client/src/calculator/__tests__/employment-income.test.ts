import { calculateEmploymentIncome } from "../employment-income";
import { EmploymentIncome } from "src/types";
import { CalculationInfo } from "../types";

describe("Employment Income Calculator", () => {
  const baseIncome: EmploymentIncome = {
    id: 1,
    personId: 0,
    type: "employment-income",
    enabled: true,
    stable: true,
    name: "Test Job",
    startAge: 53,
    firstYearProratePercent: 100,
    income: { type: "monthly", value: 1000 },
    yearlyIncrease: { type: "none" },
    retirementAgeYear: 65,
  } as any;

  const baseInfo: CalculationInfo<EmploymentIncome> = {
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
        id: 1,
        name: "Jane",
        birthday: "1975-01-01",
      },
    ],
    incomes: [baseIncome],
    inflationType: "Nominal",
    dead: -1,
  };

  it("should calculate basic monthly amount converted to annual", () => {
    const result = calculateEmploymentIncome(baseInfo);
    expect(result.amount).toBe(12000);
  });

  it("should return 0 before start age", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, startAge: 54 },
    };
    expect(calculateEmploymentIncome(info).amount).toBe(0);
  });

  it("should return 0 after retirement age", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, retirementAgeYear: 60 },
      currentYear: 2031, // person is 61
    };
    expect(calculateEmploymentIncome(info).amount).toBe(0);
  });

  it("should return 0 if person is dead", () => {
    const info = {
      ...baseInfo,
      deathYears: [2022],
      dead: 0,
    };
    expect(calculateEmploymentIncome(info).amount).toBe(0);
  });

  it("should apply first year prorate", () => {
    const info = {
      ...baseInfo,
      income: { ...baseIncome, firstYearProratePercent: 50 },
    };
    const result = calculateEmploymentIncome(info);
    expect(result.amount).toBe(6000); // 12000 * 0.5
  });

  it("should apply inflation adjustment", () => {
    const info = {
      ...baseInfo,
      inflation: 20,
      currentYear: 2024,
      inflationType: "Real",
    };
    const result = calculateEmploymentIncome(info);
    expect(result.amount).toBe(10000); // 12000 * (1 - 0.2)
  });

  it("should handle partial retirement year", () => {
    const info = {
      ...baseInfo, 
      currentYear: 2035,
      income: {
        ...baseIncome,
        retirementAgeYear: 65,
        retirementAgeMonth: 6,
      },
    };
    const result = calculateEmploymentIncome(info);
    expect(result.amount).toBe(6000); // 12000 * (6/12)
  });
});
