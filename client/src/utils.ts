export function updateAtIndex<T>(arr: T[], index: number, update: T) {
  return arr.map((v, i) => (i === index ? update : v));
}

export const splitDate = (date: string) => {
  const [year, month, day] = date.split("-").map((v) => parseInt(v));
  return { year, month, day };
};

export const yearRange: (start: number, end: number) => number[] = (
  start,
  end,
) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const printNumberOld = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

export const printNumber = (s: number) => {
  if (Math.abs(s) < 0.001) return printNumberOld(0);
  return s < 0 ? `(${printNumberOld(s).replace("-", "")})` : printNumberOld(s);
};

export const printReport = async (clientId: number, scenarioId: number) => {
  const pdfFile = await fetch(
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

export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
    }

    // Get the image blob
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // The result contains the base64 string
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert image to base64"));
      };

      // Read the blob as a base64 string
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

export function roundedToFixed(input: number, digits: number) {
  const rounder = Math.pow(10, digits);
  return Math.round(input * rounder) / rounder;
}

export const debounce = (callback: Function, wait: number) => {
  let timeoutId: number = 0;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

export const moyrToAnnual = (input: MonthlyYearlyAmount) => {
  if (input.type === "yearly") return input.value;
  return input.value * 12;
};

export const convertToMoYr = (amount: number) => ({
  type: "yearly" as const,
  value: amount,
});

export const getTaxRate = (
  client: Client,
  scenario: ScenarioSettings,
  year: number,
) => {
  if (!client.taxesFlag || scenario.taxType === "Pre-Tax") return 0;

  if (year >= (scenario.retirementYear || 0)) {
    return (client.spending.postTaxRate || 0) / 100;
  } else {
    return (client.spending.preTaxRate || 0) / 100;
  }
};
