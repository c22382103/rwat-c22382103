// game-utils.test.js
import { parseBoardSize, getTotalPairs } from "./game-utils.js";

test("parseBoardSize returns correct rows, cols and totalPairs for valid size", () => {
  const result = parseBoardSize("3x4");

  expect(result.rows).toBe(3);
  expect(result.cols).toBe(4);
  expect(result.totalPairs).toBe(6); // 3 * 4 / 2
});

test("parseBoardSize falls back to default 3x4 for invalid input", () => {
  const result = parseBoardSize("axby"); // invalid numbers

  expect(result.rows).toBe(3);
  expect(result.cols).toBe(4);
  expect(result.totalPairs).toBe(6);
});

test("getTotalPairs calculates pairs correctly", () => {
  expect(getTotalPairs(2, 2)).toBe(2);   // 4 cards = 2 pairs
  expect(getTotalPairs(3, 4)).toBe(6);   // 12 cards = 6 pairs
});