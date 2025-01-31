import { getSelectedSequences } from "./randomReturn";

export interface CalculationRow {
  age: number;
  ranOut: boolean;
  year: number;
  beginning: number;
  totalPayments: number;
  return: number;
  growth: number;
  taxes: number;
  investmentFee: number;
  endingBalance: number;
  realBalance: number;
}

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
    taxRate: number;
    inflation: number;
    investmentFee: number;
  };
  solve: {
    field: "return" | "payment" | "presentValue";
  };
  returns: {
    rateOfReturn: number;
    returnType: "simple" | "detailed" | "random";
    yearlyReturns: { [key: number]: number };
    mean: number;
    std: number;
    selectedRandom: "mean" | "worst" | "best";
    seed: number;
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
    startYear: 1,
    years: {},
    detailedIncrease: 0,
    type: "simple" as const,
  },
  other: {
    investmentFee: 0,
    taxRate: 0,
    inflation: 0,
  },
  solve: {
    field: "return",
  },
  returns: {
    rateOfReturn: 0,
    yearlyReturns: {},
    returnType: "simple" as const,
    mean: 0,
    std: 0,
    selectedRandom: "mean",
    seed: 0,
  },
};

export const getReturns = (settings: CalculatorSettings) => {
  const seqs =
    settings.returns.returnType === "random"
      ? getSelectedSequences(settings)
      : [[]];

  return (year: number) => {
    if (settings.returns.returnType === "detailed") {
      return settings.returns.yearlyReturns[year] || 0;
    } else if (settings.returns.returnType === "simple") {
      return settings.returns.rateOfReturn;
    } else if (settings.returns.returnType === "random") {
      if (settings.returns.selectedRandom === "worst") {
        return seqs[0][year - 1];
      } else if (settings.returns.selectedRandom === "best") {
        return seqs[2][year - 1];
      } else {
        return seqs[1][year - 1];
      }
    } else {
      return 0;
    }
  };
};

export const calculateProjection = (
  settings: CalculatorSettings,
  returnsMemo: (y: number) => number,
) => {
  const rows: CalculationRow[] = [];
  let balance = settings.user.presentValue;

  for (let year = 1; year <= settings.user.endYear; year++) {
    const beginning = balance;
    const realBalance = beginning;

    // Calculate payment
    let payment = 0;
    if (year >= settings.payment.startYear) {
      const yearsFromStart = year - settings.payment.startYear;
      if (settings.payment.type === "simple") {
        payment =
          -(
            settings.payment.amount *
            Math.pow(1 + settings.payment.increase / 100, yearsFromStart)
          ) / Math.pow(1 + settings.other.inflation / 100, yearsFromStart);
      } else {
        payment = -settings.payment.years[year] || 0;
      }
    }

    const investmentFee =
      beginning > 0
        ? beginning * ((settings.other.investmentFee || 0) / 100)
        : 0;

    // Handle beginning of year payment
    let ending = beginning;
    if (settings.payment.timing === "beginning") {
      if (beginning <= 0 || -payment >= ending) {
        rows.push({
          age: settings.user.startAge + year,
          investmentFee,
          year,
          beginning: beginning <= 0 ? 0 : beginning,
          totalPayments: -ending,
          return: 0,
          growth: 0,
          taxes: 0,
          endingBalance: 0,
          realBalance: realBalance + payment,
          ranOut: true,
        });
        balance = 0;
        continue;
      }
      ending += payment;
    }

    // Apply inflation
    ending /= 1 + settings.other.inflation / 100;

    // Calculate returns and taxes
    let returnRate = returnsMemo(year);
    ending -= investmentFee / 2;
    const returnAmount = ending > 0 ? ending * (returnRate / 100) : 0;
    const taxes = Math.max(returnAmount * (settings.other.taxRate / 100), 0);
    const growth = returnAmount - taxes;
    const endOfYearInvestmentFee =
      ((ending + growth) * (settings.other.investmentFee / 100)) / 2;
    const totalInvestmentFee = investmentFee / 2 + endOfYearInvestmentFee;
    ending -= endOfYearInvestmentFee;

    // Handle end of year payment
    if (settings.payment.timing === "end") {
      if (ending <= 0 || -payment >= ending) {
        rows.push({
          age: settings.user.startAge + year,
          year,
          investmentFee: totalInvestmentFee,
          beginning: beginning <= 0 ? 0 : beginning,
          totalPayments: -ending,
          return: 0,
          growth: 0,
          taxes: 0,
          endingBalance: 0,
          realBalance: realBalance + payment,
          ranOut: true,
        });
        balance = 0;
        continue;
      }
      ending += payment;
    }

    ending += growth;

    rows.push({
      age: settings.user.startAge + year,
      year,
      beginning: beginning <= 0 ? 0 : beginning,
      totalPayments: beginning <= 0 ? 0 : payment,
      return: returnAmount,
      growth,
      taxes,
      investmentFee: totalInvestmentFee,
      endingBalance: ending,
      realBalance: ending,
      ranOut: false,
    });

    balance = ending;
  }
  return rows;
};

export const cagr = (returns: number[]) => {
  const final = returns.reduce((prev, x) => prev * (1 + x / 100), 1);
  const cagr = Math.pow(final, 1 / returns.length) - 1;
  return Math.round(cagr * 10000) / 100;
};
