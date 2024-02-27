export function updateAtIndex<T>(arr: T[], index: number, update: T) {
  return arr.map((v, i) => (i === index ? update : v));
}

export const splitDate = (date: string) => {
  let [year, month, day] = date.split("-").map((v) => parseInt(v));
  return { year, month, day };
};
