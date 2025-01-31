import { useInfo } from "src/useData";
import { CalculatorSettings, calculateProjection } from "./versatileTypes";
import Select from "../Inputs/Select";
import Button from "../Inputs/Button";

const Solve = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator as CalculatorSettings;
  const solveOptions = [
    { id: "return", name: "Rate of Return" },
    { id: "presentValue", name: "Present Value" },
    { id: "payment", name: "Payment" },
  ];

  const updateSettings = (
    category: keyof CalculatorSettings,
    field: string,
    value: number | string,
  ) => {
    setField("versatileCalculator")({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    });
  };

  const solve = () => {
    if (settings.solve.field === "return" || !settings.solve.field) {
      handleSolveRateOfReturn();
    } else if (settings.solve.field === "presentValue") {
      handleSolvePresentValue();
    } else if (settings.solve.field === "payment") {
      handleSolvePayments();
    }
  };
  const handleSolvePayments = () => {
    const targetEndingBalance = settings.user.endValue || 0;
    let low = -10000000;
    let high = 1000000;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 500;
    const tolerance = 0.001;

    const testSettings = structuredClone(settings);
    testSettings.payment.type = "simple";
    while (iteration < maxIterations) {
      mid = (low + high) / 2;
      testSettings.payment.amount = mid;
      setField("versatileCalculator")({
        ...settings,
        payment: { ...settings.payment, amount: mid },
      });
      const calculations = calculateProjection(testSettings);

      const lastRow = calculations[calculations.length - 1];

      console.log("cc", mid, low, high, lastRow.realBalance);
      if (Math.abs(lastRow.realBalance - targetEndingBalance) < tolerance) {
        break;
      }

      if (lastRow.realBalance < targetEndingBalance) {
        high = mid;
      } else {
        low = mid;
      }

      iteration++;
    }
    setField("versatileCalculator")({
      ...settings,
      payment: {
        ...settings.payment,
        amount: mid,
        type: "simple",
      },
    });
  };

  const handleSolveRateOfReturn = () => {
    const targetEndingBalance = settings.user.endValue || 0;
    let low = 0;
    let high = 100;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 200;
    const tolerance = 0.001;

    const testSettings = structuredClone(settings);
    testSettings.other.returnType = "simple";
    while (iteration < maxIterations) {
      mid = (low + high) / 2;
      testSettings.other.rateOfReturn = mid;
      setField("versatileCalculator")({
        ...settings,
        other: { ...settings.other, rateOfReturn: mid },
      });
      const calculations = calculateProjection(testSettings);

      const lastRow = calculations[calculations.length - 1];

      console.log(mid, low, high, lastRow.realBalance);
      if (Math.abs(lastRow.realBalance - targetEndingBalance) < tolerance) {
        break;
      }

      if (lastRow.realBalance > targetEndingBalance) {
        high = mid;
      } else {
        low = mid;
      }

      iteration++;
    }
    setField("versatileCalculator")({
      ...settings,
      other: {
        ...settings.other,
        rateOfReturn: mid,
        returnType: "simple",
      },
    });
  };

  const handleSolvePresentValue = () => {
    const targetEndingBalance = settings.user.endValue || 0;
    let low = 0;
    let high = 10000000;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 200;
    const tolerance = 0.001;

    const testSettings = structuredClone(settings);
    while (iteration < maxIterations) {
      mid = (low + high) / 2;
      testSettings.user.presentValue = mid;
      // setField("versatileCalculator")({
      //   ...settings,
      //   user: { ...settings.other, presentValue: mid },
      // });
      const calculations = calculateProjection(testSettings);

      const lastRow = calculations[calculations.length - 1];

      console.log(mid, low, high, lastRow.realBalance);
      if (Math.abs(lastRow.realBalance - targetEndingBalance) < tolerance) {
        break;
      }

      if (lastRow.realBalance > targetEndingBalance) {
        high = mid;
      } else {
        low = mid;
      }

      iteration++;
    }
    setField("versatileCalculator")({
      ...settings,
      user: {
        ...settings.user,
        presentValue: Math.round(mid),
      },
    });
  };

  return (
    <div className="flex gap-6 items-end">
      <div className="w-48">
        <Select
          vertical
          label="Solve for:"
          options={solveOptions}
          selected={
            solveOptions.find((o) => o.id === settings.solve.field) || {
              id: "return",
              name: "Rate of Return",
            }
          }
          setSelected={(option) => updateSettings("solve", "field", option.id)}
        />
      </div>
      <div className="w-28">
        <Button type="primary" onClick={solve}>
          Solve
        </Button>
      </div>
    </div>
  );
};

export default Solve;
