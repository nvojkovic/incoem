import { calculateBasicAnnuity } from "./basic-annuity";
import { calculateCompanyPension } from "./company-pension";
import { calculateEmploymentIncome } from "./employment-income";
import { calculateOtherIncome } from "./other-income";
import { calculatePaydown } from "./paydown";

const calculate = (info: CalculationInfo<Income>) => {
  if (info.income.type === "employment-income") {
    return calculateEmploymentIncome(info as CalculationInfo<EmploymentIncome>);
  } else if (info.income.type === "company-pension") {
    return calculateCompanyPension(info as CalculationInfo<CompanyPension>);
  } else if (info.income.type === "paydown") {
    return calculatePaydown(info as CalculationInfo<Paydown>);
  } else if (info.income.type === "other-income") {
    return calculateOtherIncome(info as CalculationInfo<OtherIncome>);
  } else if (info.income.type === "basic-annuity") {
    return calculateBasicAnnuity(info as CalculationInfo<BasicAnnuity>);
  } else {
    throw new Error("Unknown income type");
  }
};

export default calculate;
