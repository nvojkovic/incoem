export interface CalculationInfo<T extends Income> {
  people: Person[];
  incomes: Income[];
  inflation?: number;
  income: T;
  startYear: number;
  currentYear: number;
  deathYears: number[];
  inflationType: string;
  ssSurvivorAge: (number | null)[];
  dead: number;
}
