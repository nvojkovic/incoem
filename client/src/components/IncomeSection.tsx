import CompanyPension from "./Info/CompanyPension";
import BasicAnnuity from "./Info/BasicAnnuity";
import Paydown from "./Info/Paydown";
import OtherIncome from "./Info/OtherIncome";
import SocialSecurity from "./Info/SocialSecurity";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import Confirm from "./Confirm";
import { useState } from "react";
import title from "../calculator/title";
import Toggle from "./Inputs/Toggle";
import AddIncome from "./Info/AddIncome";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import SortableItem from "./Sortable/SortableItem";
import { useInfo } from "../hooks/useData";
import Input from "./Inputs/Input";
import Layout from "./Layout";
import { EmploymentIncome, Income, SocialSecurityIncome } from "src/types";
import EmploymentIncomeComponent from "./Info/EmploymentIncome";

export const IncomeComponent = ({
  income,
  i,
}: {
  income: Income;
  i: number;
}) => {
  const { data, setIncome } = useInfo();
  const people = data.people;
  if (income.type === "employment-income")
    return (
      <EmploymentIncomeComponent
        key={i}
        people={people}
        income={income as EmploymentIncome}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "social-security")
    return (
      <SocialSecurity
        key={i}
        people={people}
        income={income as SocialSecurityIncome}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "annuity")
    return (
      <BasicAnnuity
        key={i}
        people={people}
        annuity={income as any}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "other-income")
    return (
      <OtherIncome
        key={i}
        people={people}
        annuity={income as any}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "paydown")
    return (
      <Paydown
        key={i}
        people={people}
        paydown={income as any}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "company-pension")
    return (
      <CompanyPension
        key={i}
        people={people}
        pension={income as any}
        setIncome={(income) => setIncome(i, income)}
      />
    );
};

const IncomeSection = () => {
  const [removeOpen, setRemoveOpen] = useState(-1);
  const { data, removeIncome, setIncome, setField } = useInfo();
  const updateIncomes = (incomes: Income[]) => setField("incomes")(incomes);
  const incomes = data.incomes;
  const people = data.people;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = incomes.findIndex((s) => s.id === active.id);
    const newIndex = incomes.findIndex((s) => s.id === over.id);
    if (oldIndex !== newIndex) {
      updateIncomes(arrayMove([...incomes], oldIndex, newIndex));
    }
  };
  return (
    <Layout page="data">
      <div>
        <div className="flex gap-6 items-center justify-between py-5 sticky z-50 top-[72px] bg-[#f3f4f6] px-[10px] ml-[-10px] w-[1428px]">
          <div className="font-semibold text-2xl">Income information</div>
          <div className=" flex gap-3 h-10 items-end">
            <div className="w-[140px]">
              <Input
                label="General Inflation"
                vertical
                value={data.liveSettings.inflation}
                subtype="percent"
                width="!w-[120px]"
                setValue={(i) =>
                  setField("liveSettings")({
                    ...data.liveSettings,
                    inflation: i,
                  })
                }
              />
            </div>
            <div className="mr-4">
              <AddIncome />
            </div>
          </div>
        </div>
        {incomes.length === 0 && (
          <div className="w-full h-[calc(100vh-300px)] flex justify-center items-center text-gray-500 text-xl">
            This client has no incomes yet. Add an income by pressing the button
            on top right.
          </div>
        )}
        <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={incomes} strategy={rectSortingStrategy}>
              {incomes.map((item, i) => (
                <SortableItem key={item.id} id={item.id}>
                  <div
                    style={item.enabled ? {} : { filter: "opacity(50%)" }}
                    className="shadow-md h-full rounded-xl bg-white"
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex items-center mb-6 pb-4  border-b">
                        <div className="flex justify-start cursor-pointer mr-2">
                          <EllipsisVerticalIcon className="text-slate-800 w-5 mr-[-15px]" />
                          <EllipsisVerticalIcon className="text-slate-800 w-5 mr-[-15px]" />
                          <EllipsisVerticalIcon className="text-slate-800 w-5 " />
                        </div>
                        <div className="font-semibold text  flex justify-between items-center flex-grow">
                          <div>{title(incomes, people, i)}</div>
                          <div className="flex items-center gap-3">
                            <Toggle
                              enabled={item.enabled}
                              setEnabled={(enabled) =>
                                setIncome(i, { ...item, enabled })
                              }
                            />
                            <div
                              className="bg-[rgba(240,82,82,0.1)] p-3 rounded-full cursor-pointer"
                              onClick={() => setRemoveOpen(i)}
                            >
                              <TrashIcon className="text-red-500 w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="">
                          <IncomeComponent income={item} i={i} />
                          {data.stabilityRatioFlag && (
                            <div className="mt-3">
                              <Input
                                label="Stable Income"
                                subtype="toggle"
                                size="lg"
                                value={item.stable}
                                setValue={(stable) =>
                                  setIncome(i, { ...item, stable })
                                }
                              />
                            </div>
                          )}
                        </div>
                        <Confirm
                          isOpen={removeOpen == i}
                          onClose={() => setRemoveOpen(-1)}
                          onConfirm={() => {
                            removeIncome(i);
                            setRemoveOpen(-1);
                          }}
                        >
                          <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                          <div className="mb-5">
                            Are you sure you want to delete this income?
                          </div>
                        </Confirm>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </Layout>
  );
};

export default IncomeSection;
