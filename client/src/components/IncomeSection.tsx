import Button from "./Inputs/Button";
import EmploymentIncome from "./Info/EmploymentIncome";
import MapSection from "./MapSection";
import { newIncome } from "../createIncome";
import CompanyPension from "./Info/CompanyPension";
import BasicAnnuity from "./Info/BasicAnnuity";
import Paydown from "./Info/Paydown";
import OtherIncome from "./Info/OtherIncome";

interface Props {
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  incomes: Income[];
  people: Person[];
  removeIncome: (index: number) => void;
  setIncome: (index: number, income: Income) => void;
  addIncome: (income: Income) => void;
  type: IncomeType;
}

const IncomeSection = ({
  title,
  defaultOpen = false,
  incomes,
  removeIncome,
  people,
  setIncome,
  addIncome,
  type,
}: Props) => {
  return (
    <MapSection title={title} defaultOpen={defaultOpen}>
      <div className="flex items-center mb-4">
        <Button type="primary" onClick={() => addIncome(newIncome(type))}>
          + {title}
        </Button>
      </div>
      <div className="flex gap-4 flex-col overflow-x-scroll">
        {incomes.map((income, i) => {
          if (income.type === type && income.type === "employment-income")
            return (
              <EmploymentIncome
                key={i}
                people={people}
                remove={() => removeIncome(i)}
                income={income as EmploymentIncome}
                setIncome={(income) => setIncome(i, income)}
              />
            );
          else if (income.type === type && income.type === "social-security")
            return <div>Not implemented</div>;
          else if (income.type === type && income.type === "basic-annuity")
            return (
              <BasicAnnuity
                key={i}
                people={people}
                remove={() => removeIncome(i)}
                annuity={income as BasicAnnuity}
                setIncome={(income) => setIncome(i, income)}
              />
            );
          else if (income.type === type && income.type === "other-income")
            return (
              <OtherIncome
                key={i}
                people={people}
                remove={() => removeIncome(i)}
                annuity={income as OtherIncome}
                setIncome={(income) => setIncome(i, income)}
              />
            );
          else if (income.type === type && income.type === "paydown")
            return (
              <Paydown
                key={i}
                people={people}
                remove={() => removeIncome(i)}
                paydown={income as Paydown}
                setIncome={(income) => setIncome(i, income)}
              />
            );
          else if (income.type === type && income.type === "company-pension")
            return (
              <CompanyPension
                key={i}
                people={people}
                remove={() => removeIncome(i)}
                pension={income as CompanyPension}
                setIncome={(income) => setIncome(i, income)}
              />
            );
        })}
      </div>
    </MapSection>
  );
};

export default IncomeSection;
