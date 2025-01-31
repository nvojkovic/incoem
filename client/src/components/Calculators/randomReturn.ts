import { CalculatorSettings, calculateProjection } from "./versatileTypes";

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

export const getSequences = (
  seed: number,
  mean: number,
  std: number,
  length: number,
) => {
  const random = new SeededRandom(seed);
  const seqs = Array.from({ length: 1000 }, (_) =>
    sequenceOfReturns(random, mean, std, length),
  );
  console.log(seqs);
  return seqs;
};

export const getSelectedSequences = (settings: CalculatorSettings) => {
  const sequences = getSequences(
    settings.returns.seed || 0,
    settings.returns.mean,
    settings.returns.std,
    settings.user.endYear,
  );
  console.log("using seed", settings.returns.seed);
  const results = sequences.map((seq) => {
    console.log(settings);
    const sett = structuredClone(settings);
    sett.returns.returnType = "detailed";
    sett.returns.yearlyReturns = seq;
    const proj = calculateProjection(sett);
    return { seq, val: proj.pop()?.realBalance as number };
  });

  const sorted = results.sort((a, b) => a.val - b.val);
  console.log(sorted);
  return [sorted[0].seq, sorted[500].seq, sorted[999].seq];
};
