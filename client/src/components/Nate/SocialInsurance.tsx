import Container from "./Container";
import MapSection from "../MapSection";
import Input from "../Inputs/Input";
import { useInfo } from "src/hooks/useData";
import { SocialInsurance } from "./types";
import { NRA } from "src/calculator/utils";
import { printNumber, splitDate } from "src/utils";

const SocialInsurancePage = () => {
  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  if (data.people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }

  const setIncome = (
    index: number,
    field: keyof SocialInsurance,
    value: SocialInsurance[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      socialInsurance: data.assetSummary.socialInsurance.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  return (
    <Container active="social-insurance">
      <MapSection
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Social Insurance </div>
          </div>
        }
        defaultOpen
        toggleabble
      >
        <table className="w-full">
          <thead
            className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
          >
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Full Retirement Age</th>
              <th className="px-6 py-3 font-medium">Full Retirement Date</th>
              <th className="px-6 py-3 font-medium">Monthly Income</th>
              <th className="px-6 py-3 font-medium">Annual Income</th>
            </tr>
          </thead>
          <tbody>
            {data.assetSummary.socialInsurance.map(
              (line, index) =>
                data.people[line.owner] && (
                  <tr className="">
                    <td className="px-2 py-2 w-[500px]">
                      <Input
                        disabled
                        value={data.people[line.owner].name}
                        setValue={() => { }}
                        size="full"
                        subtype="text"
                        label={``}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        disabled
                        value={(() => {
                          const { year: birthYear } = splitDate(
                            data.people[line.owner].birthday,
                          );
                          const [retirementYear, retirementMonth] =
                            NRA(birthYear);
                          return `${retirementYear} years ${retirementMonth} months`;
                        })()}
                        setValue={() => { }}
                        size="full"
                        subtype="text"
                        label={``}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        disabled
                        value={(() => {
                          const { year: birthYear } = splitDate(
                            data.people[line.owner].birthday,
                          );
                          const birthday = new Date(
                            data.people[line.owner].birthday,
                          );
                          const [retirementYear, retirementMonth] =
                            NRA(birthYear);
                          birthday.setMonth(
                            birthday.getMonth() + retirementMonth,
                          );
                          birthday.setFullYear(
                            birthday.getFullYear() + retirementYear,
                          );
                          return birthday.toLocaleDateString();
                        })()}
                        setValue={() => { }}
                        size="full"
                        subtype="text"
                        label={``}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        label=""
                        vertical
                        size="full"
                        value={line.monthlyAmount}
                        setValue={(v) => setIncome(index, "monthlyAmount", v)}
                        subtype="money"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        label=""
                        disabled
                        vertical
                        size="full"
                        value={line.monthlyAmount && line.monthlyAmount * 12}
                        setValue={() => { }}
                        subtype="money"
                      />
                    </td>
                  </tr>
                ),
            )}
            <tr>
              <td className="px-2 py-3 font-medium"></td>
              <td className="px-2 py-3 font-medium"></td>
              <td className="px-2 py-3 font-medium">Total:</td>
              <td className="px-2 py-3 font-medium text-center">
                {printNumber(
                  data.assetSummary.socialInsurance
                    .map((i) => i.monthlyAmount || 0)
                    .reduce((a, b) => a + b, 0),
                )}{" "}
                / mo
              </td>
              <td className="px-2 py-3 font-medium text-center">
                {printNumber(
                  data.assetSummary.socialInsurance
                    .map((i) => i.monthlyAmount || 0)
                    .reduce((a, b) => a + b, 0) * 12,
                )}{" "}
                / yr
              </td>
            </tr>
          </tbody>
        </table>
      </MapSection>
    </Container>
  );
};

export default SocialInsurancePage;
