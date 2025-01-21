import { useState } from "react";
import Container from "./Container";
import MapSection from "../MapSection";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "../Inputs/Input";
import Confirm from "../Confirm";
import Button from "../Inputs/Button";
import { useInfo } from "src/useData";
import Select from "../Inputs/Select";
import { HardAsset } from "./types";
import { printNumber } from "src/utils";

const HardAssets = () => {
  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  if (data.people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }

  const setAsset = (
    index: number,
    field: keyof HardAsset,
    value: HardAsset[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      hardAssets: data.assetSummary.hardAssets.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  const [preDeleteOpen, setPreDeleteOpen] = useState(-1);
  return (
    <Container active="hard-assets">
      <MapSection
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Hard Assets </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("assetSummary")({
                    ...data.assetSummary,
                    hardAssets: [
                      ...data.assetSummary.hardAssets,
                      { id: crypto.randomUUID() },
                    ],
                  });
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="h-4" />
                  Add
                </div>
              </Button>
            </div>
          </div>
        }
        defaultOpen
      >
        <table className="w-full">
          <thead
            className={`text-xs cursor-pointer text-left sticky z-50 border-1 !font-normal`}
          >
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Owner</th>
              <th className="px-6 py-3 font-medium">Cost Basis</th>
              <th className="px-6 py-3 font-medium">Net Income</th>
              <th className="px-6 py-3 font-medium">Debt</th>
              <th className="px-6 py-3 font-medium">Market Value</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assetSummary.hardAssets.map((line, index) => (
              <tr className="">
                <td className="px-2 py-2 ">
                  <Input
                    vertical
                    value={line.name}
                    setValue={(v) => setAsset(index, "name", v)}
                    size="full"
                    subtype="text"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    options={[
                      "Real Estate",
                      "Business",
                      "Collectibles",
                      "Auto",
                    ].map((name) => ({ name, id: name }))}
                    selected={{
                      name: line.type,
                      id: line.type,
                    }}
                    setSelected={(i) => setAsset(index, "type", i.id)}
                    label=""
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    options={options}
                    selected={
                      line.owner == -1
                        ? { name: "Joint", id: -1 }
                        : data.people[line.owner]
                    }
                    setSelected={(i) => setAsset(index, "owner", i.id)}
                    label=""
                  />
                </td>

                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.costBasis}
                    setValue={(v) => setAsset(index, "costBasis", v)}
                    subtype="money"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.netIncome}
                    setValue={(v) => setAsset(index, "netIncome", v)}
                    subtype="money"
                  />
                </td>
                <td className="px-2 py-2">TODO</td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.marketValue}
                    setValue={(v) => setAsset(index, "marketValue", v)}
                    subtype="money"
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-3">
                    <Confirm
                      isOpen={preDeleteOpen === index}
                      onClose={() => setPreDeleteOpen(-1)}
                      onConfirm={() => {
                        setPreDeleteOpen(-1);
                        setField("assetSummary")({
                          ...data.assetSummary,
                          hardAssets: data.assetSummary.hardAssets.filter(
                            (_, ind) => ind !== index,
                          ),
                        });
                      }}
                    >
                      <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                      <div className="mb-5">
                        Are you sure you want to delete this hard asset?
                      </div>
                    </Confirm>
                    <Button
                      type="secondary"
                      onClick={() => {
                        return setPreDeleteOpen(index);
                      }}
                    >
                      <div className="flex justify-center">
                        <TrashIcon className="h-5 text-red-500" />
                      </div>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!!data.assetSummary.hardAssets.length && (
              <tr>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium">Total:</td>
                <td className="px-2 py-3 font-medium text-center">
                  {printNumber(
                    data.assetSummary.hardAssets
                      .map((i) => i.netIncome || 0)
                      .reduce((a, b) => a + b, 0),
                  )}
                </td>
                <td className="px-2 py-3 font-medium text-center">TODO</td>
                <td className="px-2 py-3 font-medium text-center">
                  {printNumber(
                    data.assetSummary.hardAssets
                      .map((i) => i.marketValue || 0)
                      .reduce((a, b) => a + b, 0),
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </MapSection>
    </Container>
  );
};

export default HardAssets;
