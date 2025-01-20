import { IncomeComponent } from "../IncomeSection";
import Modal from "../Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import title from "../../calculator/title";
import { useInfo } from "../../useData";
import { useUser } from "../../useUser";
import Input from "../Inputs/Input";
import { Income } from "src/types";

const IncomeModal = ({
  income,
  i,
  open,
  setOpen,
}: {
  income: Income;
  i: number;
  open: boolean;
  setOpen: any;
}) => {
  const { user } = useUser();
  const { data, setIncome } = useInfo();
  const incomes = data.data.incomes;
  const people = data.data.people;
  const index = incomes.findIndex((inc) => inc.id === i);
  if (!data) return;
  return (
    <>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className="flex justify-between mb-5">
          <div className="text-lg font-semibold w-72 text-left">
            {title(incomes, people, index)}
          </div>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-4 items-center w-full text-left">
            <IncomeComponent income={income} i={index} />
            {user?.info?.stabilityRatioFlag && (
              <Input
                label="Stable Income"
                subtype="toggle"
                size="lg"
                value={income.stable}
                setValue={(stable) => {
                  setIncome(index, { ...income, stable });
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IncomeModal;
