const title = (income: Income[], people: Person[], i: number) => {
  let person: any = people.find((p) => p.id === income[i].personId);
  if (!person) {
    person = { name: "Joint" };
  }
  const totalOfType = income.filter(
    (r) => r.type === income[i].type && r.personId == income[i].personId,
  ).length;

  let type = income[i].type
    .split("-")
    .map((i) => (i as any).capitalize())
    .filter((i) => i !== "Income")
    .join(" ");
  if (["basic-annuity", "company-pension"].includes(income[i].type))
    type = ((income[i] as any).name || type) + " ";

  if (totalOfType === 1) return `${person.name} | ${type}`;
  else {
    let cnt = 0;
    for (let j = 0; j < i; j++) {
      if (
        income[j].type === income[i].type &&
        income[j].personId === income[i].personId
      )
        cnt++;
    }
    return `${person.name} | ${type} #${cnt + 1}`;
  }
};

(String.prototype as any).capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default title;
