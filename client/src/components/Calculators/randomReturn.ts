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
  seed: number,
  mean: number,
  std: number,
  length: number,
) => {
  const random = new SeededRandom(seed);
  return Array.from({ length }, () => random.normal(mean, std));
};
