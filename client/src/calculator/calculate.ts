import {
  BasicAnnuity,
  CompanyPension,
  EmploymentIncome,
  Income,
  OtherIncome,
  Paydown,
  SocialSecurityIncome,
} from "src/types";
import { calculateBasicAnnuity } from "./basic-annuity";
import { calculateCompanyPension } from "./company-pension";
import { calculateEmploymentIncome } from "./employment-income";
import { calculateOtherIncome } from "./other-income";
import { calculatePaydown } from "./paydown";
import { calculateSocialSecurity } from "./social-security";
import { CalculationInfo } from "./types";

interface CalculationResult {
  amount: number;
  note: string;
}

const calculate = (info: CalculationInfo<Income>): CalculationResult => {
  if (info.income.type === "employment-income") {
    return calculateEmploymentIncome(info as CalculationInfo<EmploymentIncome>);
  } else if (info.income.type === "social-security") {
    return calculateSocialSecurity(
      info as CalculationInfo<SocialSecurityIncome>,
    );
  } else if (info.income.type === "company-pension") {
    return calculateCompanyPension(info as CalculationInfo<CompanyPension>);
  } else if (info.income.type === "paydown") {
    return calculatePaydown(info as CalculationInfo<Paydown>);
  } else if (info.income.type === "other-income") {
    return calculateOtherIncome(info as CalculationInfo<OtherIncome>);
  } else if (info.income.type === "annuity") {
    return calculateBasicAnnuity(info as CalculationInfo<BasicAnnuity>);
  } else {
    return { amount: -1, note: "" };
    throw new Error("Unknown income type");
  }
};

export default calculate;
