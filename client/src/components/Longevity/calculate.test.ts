import { makeTable, jointTable, findFiftyPercentPoint, findAgeForProbability, findYearForProbability } from './calculate';
import { Person } from 'src/types';

describe('Longevity Calculations', () => {
  const person1: Person = {
    id: 1,
    name: "John",
    birthday: "1970-01-01",
    sex: "Male"
  };

  const person2: Person = {
    id: 2,
    name: "Jane",
    birthday: "1975-01-01",
    sex: "Female"
  };

  describe('makeTable', () => {
    it('should generate life expectancy table for a person', () => {
      const result = makeTable(person1);
      
      expect(result.table).toBeDefined();
      expect(result.table.length).toBeGreaterThan(0);
      expect(result.e).toBeDefined();
      
      const firstRow = result.table[0];
      expect(firstRow).toHaveProperty('year');
      expect(firstRow).toHaveProperty('age');
      expect(firstRow).toHaveProperty('q');
      expect(firstRow).toHaveProperty('probability');
    });
  });

  describe('jointTable', () => {
    it('should generate joint life expectancy table for two people', () => {
      const result = jointTable(person1, person2);
      
      expect(result.length).toBeGreaterThan(0);
      
      const firstRow = result[0];
      expect(firstRow).toHaveProperty('year');
      expect(firstRow).toHaveProperty('age');
      expect(firstRow).toHaveProperty('q');
      expect(firstRow).toHaveProperty('probability');
      expect(firstRow).toHaveProperty('oneAlive');
    });
  });

  describe('findFiftyPercentPoint', () => {
    it('should find 50% survival point for given life expectancies', () => {
      const result = findFiftyPercentPoint(80, 85);
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Math.max(80, 85));
      expect(Number.isFinite(result)).toBe(true);
    });
  });

  describe('findAgeForProbability', () => {
    it('should find age for given probability', () => {
      const table = makeTable(person1).table;
      const result = findAgeForProbability(table, 50);
      
      expect(result).toHaveProperty('age');
      expect(result).toHaveProperty('year');
      expect(Number.isFinite(result.age)).toBe(true);
      expect(Number.isFinite(result.year)).toBe(true);
    });
  });

  describe('findYearForProbability', () => {
    it('should find year for given probability', () => {
      const table = jointTable(person1, person2);
      const result = findYearForProbability(table, 50);
      
      expect(result).toHaveProperty('year');
      expect(Number.isFinite(result.year)).toBe(true);
    });

    it('should handle both percentage and decimal inputs', () => {
      const table = jointTable(person1, person2);
      const result1 = findYearForProbability(table, 50);
      const result2 = findYearForProbability(table, 0.5);
      
      expect(result1.year).toBe(result2.year);
    });
  });
});
