import { IncomeComponent } from "../IncomeSection";
import Modal from "../Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import title from "../../calculator/title";
import { useInfo } from "../../useData";
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
  const { data } = useInfo();
  const incomes = data.data.incomes;
  const people = data.data.people;
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className="flex justify-between mb-5">
        <div className="text-lg font-semibold w-72 text-left">
          {title(incomes, people, i)}
        </div>
        <XMarkIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-4 items-center w-full text-left">
          <IncomeComponent income={income} i={i} />
        </div>
      </div>
    </Modal>
  );
};

export default IncomeModal;
