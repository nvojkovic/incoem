import { Income, Person } from "src/types";

export const basicTitle = (type: string) => {
  if (type == "company-pension") return "Pension";
  return type
    .split("-")
    .map((i) => (i as any).capitalize())
    .filter((i) => i !== "Income")
    .join(" ");
};

const title = (income: Income[], people: Person[], i: number) => {
  let person: any = people.find((p) => p.id === income[i].personId);
  if (!person) {
    person = { name: "Joint" };
  }
  const totalOfType = income.filter(
    (r) => r.type === income[i].type && r.personId == income[i].personId,
  ).length;

  let type = basicTitle(income[i].type);
  if (
    [
      "annuity",
      "company-pension",
      "paydown",
      "other-income",
      "employment-income",
      "social-security",
    ].includes(income[i].type)
  )
    type = ((income[i] as any).name || type) + " ";
  let nameSection = "";
  if (people.length > 1) {
    nameSection = `${person.name} | `;
  } else {
    nameSection = "";
  }

  if (totalOfType === 1) return `${nameSection}${type}`;
  else {
    let cnt = 0;
    for (let j = 0; j < i; j++) {
      if (
        income[j].type === income[i].type &&
        income[j].personId === income[i].personId &&
        !(income[j] as any).name
      )
        cnt++;
    }
    return `${nameSection}${type} ${!(income[i] as any).name ? `#${cnt + 1}` : ""}`;
  }
};
export const getOriginalTitle = (
  income: Income[],
  people: Person[],
  i: number,
) => {
  let person: any = people.find((p) => p.id === income[i].personId);
  if (!person) {
    person = { name: "Joint" };
  }
  const totalOfType = income.filter(
    (r) => r.type === income[i].type && r.personId == income[i].personId,
  ).length;

  let type = basicTitle(income[i].type);
  if (
    [
      "annuity",
      "company-pension",
      "paydown",
      "other-income",
      "employment-income",
      "social-security",
    ].includes(income[i].type)
  )
    type = type + " ";
  let nameSection = "";
  if (people.length > 1) {
    nameSection = `${person.name} | `;
  } else {
    nameSection = "";
  }

  if (totalOfType === 1) return `${nameSection}${type}`;
  else {
    let cnt = 0;
    for (let j = 0; j < i; j++) {
      if (
        income[j].type === income[i].type &&
        income[j].personId === income[i].personId &&
        !(income[j] as any).name
      )
        cnt++;
    }
    return `${nameSection}${type} ${!(income[i] as any).name ? `#${cnt + 1}` : ""}`;
  }
};

(String.prototype as any).capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default title;
