import title from "../calculator/title";

interface Col {
  accessorFn: (row: any) => any;
  cell: (info: any) => any;
  header: () => any;
  id: string;
}

export const generateColumns = (
  incomes: Income[],
  data: any,
  selectedColumn: SelectedColumn,
): Col[] => [
  {
    accessorFn: (row) => ({
      value: row.year,
      column: { type: "year", id: 0 },
      year: row.year,
      selectedColumn: selectedColumn,
    }),
    header: () => ({
      value: "Year",
      column: { type: "year", id: 0 },
      selectedColumn: selectedColumn,
    }),
    cell: (info) => info.getValue(),
    id: "year",
  },
  {
    accessorFn: (row) => ({
      value: row.age,
      year: row.year,
      selectedColumn: selectedColumn,
      column: { type: "age", id: 0 },
    }),
    cell: (info) => info.getValue(),
    header: () => ({
      value: "Age",
      column: { type: "age", id: 0 },
      selectedColumn: selectedColumn,
    }),
    id: "age",
  },
  ...incomes.map((income, i) => ({
    cell: (info: any) => info.getValue(),
    accessorFn: (row: any) => ({
      value: row[title(incomes, data.people, i)],
      year: row.year,
      incomeId: income.id,
      selectedColumn,
      column: { type: "income", id: incomes[i].id },
    }),
    id: income.id.toString(),
    header: () => ({
      incomeId: income.id,
      value: title(incomes, data.people, i)
        .split("|")
        .map((i) => (
          <span>
            {i} <br />
          </span>
        )),
      column: { type: "income", id: incomes[i].id },
      selectedColumn: selectedColumn,
      index: i,
    }),
  })),
  {
    accessorFn: (row) => ({
      value: row.total,
      selectedColumn: selectedColumn,
      year: row.year,
      column: { type: "total", id: 0 },
    }),
    cell: (info) => info.getValue(),
    header: () => ({
      value: "Total",
      column: { type: "total", id: 0 },
      selectedColumn: selectedColumn,
    }),
    id: "total",
  },
];
