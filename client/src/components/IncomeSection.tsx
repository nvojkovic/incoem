import EmploymentIncome from "./Info/EmploymentIncome";
import MapSection from "./MapSection";
import CompanyPension from "./Info/CompanyPension";
import BasicAnnuity from "./Info/BasicAnnuity";
import Paydown from "./Info/Paydown";
import OtherIncome from "./Info/OtherIncome";
import SocialSecurity from "./Info/SocialSecurity";
import Section from "./Section";
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

interface Props {
  defaultOpen?: boolean;
  incomes: Income[];
  people: Person[];
  removeIncome: (index: number) => void;
  setIncome: (index: number, income: Income) => void;
  updateIncomes: (incomes: Income[]) => void;
  addIncome: (income: Income) => void;
}

const incomeComponents = (
  income: Income,
  i: number,
  people: Person[],
  setIncome: (index: number, income: Income) => void,
) => {
  if (income.type === "employment-income")
    return (
      <EmploymentIncome
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
        annuity={income as BasicAnnuity}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "other-income")
    return (
      <OtherIncome
        key={i}
        people={people}
        annuity={income as OtherIncome}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "paydown")
    return (
      <Paydown
        key={i}
        people={people}
        paydown={income as Paydown}
        setIncome={(income) => setIncome(i, income)}
      />
    );
  else if (income.type === "company-pension")
    return (
      <CompanyPension
        key={i}
        people={people}
        pension={income as CompanyPension}
        setIncome={(income) => setIncome(i, income)}
      />
    );
};

const IncomeSection = ({
  defaultOpen = false,
  incomes,
  removeIncome,
  people,
  setIncome,
  addIncome,
  updateIncomes,
}: Props) => {
  const [removeOpen, setRemoveOpen] = useState(-1);

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
    <MapSection
      toggleabble={false}
      title={
        <div className="flex gap-6 items-center w-full justify-between">
          <div>Income information</div>
          <div className="w-36 mr">
            <AddIncome addIncome={addIncome} />
          </div>
        </div>
      }
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-3 gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={incomes} strategy={rectSortingStrategy}>
            {incomes.map((item, i) => (
              <SortableItem key={item.id} id={item.id}>
                <div style={item.enabled ? {} : { filter: "opacity(50%)" }}>
                  <Section>
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
                            className="bg-[#ffebe5] p-3 rounded-full cursor-pointer"
                            onClick={() => setRemoveOpen(i)}
                          >
                            <TrashIcon className="text-main-orange w-5 " />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-4 items-center w-full">
                        {[incomeComponents(item, i, people, setIncome)]}
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
                  </Section>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>{" "}
      </div>
    </MapSection>
  );
};

export default IncomeSection;
