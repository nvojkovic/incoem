export function updateAtIndex<T>(arr: T[], index: number, update: T) {
  return arr.map((v, i) => (i === index ? update : v));
}
