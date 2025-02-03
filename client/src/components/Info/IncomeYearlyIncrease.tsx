import { YearlyIncrease } from "src/types";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";

interface Props {
  increase: YearlyIncrease;
  setYearlyIncrease: (a: YearlyIncrease) => any;
  labels: boolean;
  customLabel?: string;
}
const IncomeYearlyIncrease = ({
  increase,
  setYearlyIncrease,
  labels,
  customLabel,
}: Props) => {
  return (
    <div className="flex gap-4 items-center">
      <div className={`text-sm text-[#344054] w-[133px]`}>
        {customLabel || "Yearly Increase"}
      </div>
      <div className={labels ? "" : "mt-1"}>
        <Select
          width={increase.type === "custom" ? "!w-[120px]" : ""}
          label={labels ? "Yearly Increase" : ""}
          tooltip={
            increase.type === "general"
              ? 'General will set the yearly increase equal to the "inflation" input set throughout the client file'
              : ""
          }
          options={[
            { value: "general", name: "General" },
            { value: "none", name: "None" },
            { value: "custom", name: "Custom" },
          ]}
          selected={{
            name: (increase.type as any)?.capitalize(),
            value: increase.type,
          }}
          setSelected={(type) =>
            setYearlyIncrease({ ...increase, type: type.value })
          }
        />
      </div>
      {increase.type == "custom" && (
        <div className="">
          <Input
            label={labels ? "Increase (%)" : ""}
            vertical
            width={labels ? "" : "!w-[63px]"}
            size="md"
            subtype="percent"
            value={increase.percent}
            setValue={(v) => setYearlyIncrease({ ...increase, percent: v })}
          />
        </div>
      )}
    </div>
  );
};

export default IncomeYearlyIncrease;
