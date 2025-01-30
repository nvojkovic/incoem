export interface CalculatorSettings {
  user: {
    startAge: number;
    endValue: number;
    presentValue: number;
    endYear: number;
  };
  payment: {
    amount: number;
    timing: "beginning" | "end";
    increase: number;
    startYear: number;
    detailedIncrease: number;
    years: { [key: number]: number };
    type: "simple" | "detailed";
  };
  other: {
    rateOfReturn: number;
    taxRate: number;
    inflation: number;
    investmentFee: number;
    returnType: "simple" | "detailed";
    yearlyReturns: { [key: number]: number };
  };
}

export const initialVersatileSettings: CalculatorSettings = {
  user: {
    startAge: 0,
    endValue: 0,
    presentValue: 0,
    endYear: 10,
  },
  payment: {
    amount: 0,
    timing: "beginning" as const,
    increase: 0,
    startYear: 0,
    years: {},
    detailedIncrease: 0,
    type: "simple" as const,
  },
  other: {
    rateOfReturn: 0,
    investmentFee: 0,
    taxRate: 0,
    inflation: 0,
    returnType: "simple" as const,
    yearlyReturns: {},
  },
};
