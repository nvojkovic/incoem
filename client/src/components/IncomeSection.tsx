import Button from "./Inputs/Button";
import EmploymentIncome from "./Info/EmploymentIncome";
import MapSection from "./MapSection";
import { newIncome } from "../createIncome";
import CompanyPension from "./Info/CompanyPension";
import BasicAnnuity from "./Info/BasicAnnuity";
import Paydown from "./Info/Paydown";
import OtherIncome from "./Info/OtherIncome";
import { PlusIcon } from "@heroicons/react/24/solid";
import SocialSecurity from "./Info/SocialSecurity";

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
    <MapSection
      title={
        <div className="flex gap-6 items-center w-full">
          <div>{title}</div>
          <div className="w-8 mr">
            <Button
              type="secondary"
              onClick={(e) => {
                addIncome(newIncome(type));
                e.stopPropagation();
              }}
            >
              <div className="text-sm">
                <PlusIcon className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      }
      defaultOpen={defaultOpen}
    >
      <div className="flex items-center mb-4 w-8"></div>
      <div className="flex gap-4 flex-col">
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
            return (
              <SocialSecurity
                key={i}
                people={people}
                remove={() => removeIncome(i)}
                income={income as SocialSecurityIncome}
                setIncome={(income) => setIncome(i, income)}
              />
            );
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
