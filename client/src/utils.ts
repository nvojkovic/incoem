export function updateAtIndex<T>(arr: T[], index: number, update: T) {
  return arr.map((v, i) => (i === index ? update : v));
}

export const splitDate = (date: string) => {
  let [year, month, day] = date.split("-").map((v) => parseInt(v));
  return { year, month, day };
};

export const yearRange: (start: number, end: number) => number[] = (
  start,
  end,
) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const printNumber = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

export const printReport = async (clientId: number, scenarioId: number) => {
  let pdfFile;
  pdfFile = await fetch(
    import.meta.env.VITE_API_URL +
    "print/client/pdf/" +
    clientId +
    "/" +
    Math.max(scenarioId, 0).toString(),
  ).then((res) => res.json());
  return import.meta.env.VITE_API_URL + "report/?report=" + pdfFile.file;
};
