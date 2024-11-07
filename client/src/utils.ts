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

export const printNumberOld = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

export const printNumber = (s: number) =>
  s < 0 ? `(${printNumberOld(s).replace("-", "")})` : printNumberOld(s);

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

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  // Handle future dates
  if (diffInSeconds < 0) {
    return "in the future";
  }

  // Handle just now
  if (diffInSeconds < 30) {
    return "just now";
  }

  // Find the appropriate interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / secondsInUnit);

    if (count >= 1) {
      // Handle singular/plural
      const plural = count === 1 ? "" : "s";
      return `${count} ${unit}${plural} ago`;
    }
  }

  return "just now";
}
