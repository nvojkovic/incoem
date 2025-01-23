import femaleTables from "src/assets/tables-female.json";
import maleTables from "src/assets/tables-male.json";
import { calculateAge } from "../Info/PersonInfo";
import { birthday } from "src/calculator/utils";
import { Person } from "src/types";

export const makeTable = (person: Person) => {
  const age = calculateAge(new Date(person.birthday));
  const { birthYear } = birthday(person);
  const selectedTable: any = person.sex === "Male" ? maleTables : femaleTables;
  const table = selectedTable[birthYear.toString()];
  const result = [];
  let aliveProbability = 1;
  for (let current = age; current < 120; current++) {
    const row = table[current];
    const [q, _] = row;
    const probability = aliveProbability * (1 - q);
    aliveProbability = probability;
    result.push({
      year: birthYear + current,
      age: current,
      q,
      probability: probability,
    });
  }

  return { table: result, e: table[age][1] + age };
};

export const jointTable = (person1: Person, person2: Person) => {
  const table1 = makeTable(person1);
  const table2 = makeTable(person2);
  const result = [];
  let aliveProbability = 1;
  for (
    let current = 0;
    current < Math.min(table1.table.length, table2.table.length);
    current++
  ) {
    const row1 = table1.table[current];
    const row2 = table2.table[current];
    const q = 1 - (1 - row1.q) * (1 - row2.q);
    const probability = aliveProbability * (1 - q);
    const oneAlive = 1 - (1 - row1.probability) * (1 - row2.probability);
    aliveProbability = probability;
    result.push({
      year: row1.year,
      age: `${row1.age} / ${row2.age}`,
      q,
      probability: probability,
      oneAlive,
    });
  }

  return result;
};

export function findFiftyPercentPoint(
  lifeExpectancy1: number,
  lifeExpectancy2: number,
): number {
  let start = 0;
  let end = Math.max(lifeExpectancy1, lifeExpectancy2);

  // Binary search to find the 50% point
  while (end - start > 0.1) {
    // Accurate to 0.1 years
    const mid = (start + end) / 2;
    const prob = calculateSurvivalProbability(
      lifeExpectancy1,
      lifeExpectancy2,
      mid,
    );

    if (prob > 0.5) {
      start = mid;
    } else {
      end = mid;
    }
  }

  return Math.round(start * 10) / 10; // Round to 1 decimal place
}

export function calculateSurvivalProbability(
  lifeExpectancy1: number,
  lifeExpectancy2: number,
  timePoint: number,
): number {
  const t = Math.min(timePoint, Math.max(lifeExpectancy1, lifeExpectancy2));
  const probDead1 = Math.min(1.0, t / lifeExpectancy1);
  const probDead2 = Math.min(1.0, t / lifeExpectancy2);
  return 1 - probDead1 * probDead2;
}

export function findAgeForProbability(
  table: Array<any>,
  targetProbability: number,
): { age: number; year: number } {
  // Convert percentage to decimal if needed
  const probability = targetProbability / 100;

  // Find the entry with the closest probability
  let closestEntry = table[0];
  let smallestDiff = Math.abs(closestEntry.probability - probability);

  for (const entry of table) {
    const diff = Math.abs(entry.probability - probability);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestEntry = entry;
    }
  }

  return {
    age:
      typeof closestEntry.age === "string"
        ? parseInt(closestEntry.age.split(" / ")[0])
        : closestEntry.age,
    year: closestEntry.year,
  };
}
export function findYearForProbability(
  table: Array<any>,
  targetProbability: number,
): { year: number } {
  // Convert percentage to decimal if needed
  const probability =
    targetProbability > 1 ? targetProbability / 100 : targetProbability;

  // Find the entry with the closest probability
  let closestEntry = table[0];
  let smallestDiff = Math.abs(closestEntry.oneAlive - probability);

  for (const entry of table) {
    const diff = Math.abs(entry.oneAlive - probability);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestEntry = entry;
    }
  }

  return {
    year: closestEntry.year,
  };
}
