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
    rateOfReturn: number;
    taxRate: number;
    inflation: number;
    investmentFee: number;
    returnType: "simple" | "detailed";
    yearlyReturns: { [key: number]: number };
  };
  solve: {
    field: "return" | "payment" | "presentValue";
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
  solve: {
    field: "return",
  },
};

export const calculateProjection = (settings: CalculatorSettings) => {
  const rows: CalculationRow[] = [];
  let balance = settings.user.presentValue;

  for (let year = 0; year <= settings.user.endYear; year++) {
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
          totalPayments: 0,
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
    let returnRate = settings.other.rateOfReturn;
    if (settings.other.returnType === "detailed") {
      returnRate = settings.other.yearlyReturns[year] || 0;
    }
    const returnAmount = ending > 0 ? ending * (returnRate / 100) : 0;
    const taxes = Math.max(returnAmount * (settings.other.taxRate / 100), 0);
    const growth = returnAmount - taxes - investmentFee;
    ending -= investmentFee;

    // Handle end of year payment
    if (settings.payment.timing === "end") {
      if (ending <= 0 || -payment >= ending) {
        rows.push({
          age: settings.user.startAge + year,
          year,
          investmentFee,
          beginning: beginning <= 0 ? 0 : beginning,
          totalPayments: 0,
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
      investmentFee,
      endingBalance: ending,
      realBalance: ending,
      ranOut: false,
    });

    balance = ending;
  }
  return rows;
};
