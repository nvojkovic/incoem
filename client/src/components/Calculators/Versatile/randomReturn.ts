import { CalculatorSettings } from "./versatileTypes";

class SeededRandom {
  seed: number;
  constructor(seed = 123456789) {
    this.seed = seed;
  }

  // basic LCG for uniform distribution
  random() {
    this.seed = (1103515245 * this.seed + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  // normal distribution using box-muller
  normal(mean = 0, stddev = 1) {
    const u1 = this.random();
    const u2 = this.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z * stddev + mean;
  }
}

export const sequenceOfReturns = (
  random: SeededRandom,
  mean: number,
  std: number,
  length: number,
) => {
  return Array.from({ length }, () => random.normal(mean, std));
};

export const getSelectedSequences = (settings: CalculatorSettings) => {
  const random = new SeededRandom(settings.returns.seed || 0);
  const sequences = Array.from({ length: 1000 }, (_) =>
    sequenceOfReturns(
      random,
      settings.returns.mean,
      settings.returns.std,
      settings.user.endYear,
    ),
  );

  const results = sequences.map((seq) => {
    console.log("aaa", settings);
    const sett = structuredClone(settings);
    sett.returns.returnType = "detailed";
    sett.returns.yearlyReturns = seq;
    const cagr = seq.map((i) => i / 100 + 1).reduce((a, b) => a * b, 1);
    // const proj = calculateProjection(sett, (y) => seq[y - 1]);
    return { seq, val: cagr };
  });

  const sorted = results.sort((a, b) => a.val - b.val);
  console.log(sorted);
  return [
    sorted[100].seq,
    sorted[500].seq,
    sorted[900].seq,
    sorted[250].seq,
    sorted[750].seq,
  ];
};
