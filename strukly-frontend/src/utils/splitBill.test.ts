import { describe, expect, it } from "vitest";
import {
  formatSplitSummary,
  getRemainingToAssign,
  isSplitBalanced,
  splitEqually,
  sumShares,
} from "./splitBill";
import { formatIDRDisplay } from "../components/money/formatIDRDisplay";

describe("splitEqually", () => {
  it("splits evenly when the total divides without remainder", () => {
    expect(splitEqually(150_000, 2)).toEqual([75_000, 75_000]);
    expect(splitEqually(90_000, 3)).toEqual([30_000, 30_000, 30_000]);
  });

  it("gives the first people one extra rupiah when the total does not divide evenly", () => {
    expect(splitEqually(1_000, 3)).toEqual([334, 333, 333]);
    expect(splitEqually(10, 4)).toEqual([3, 3, 2, 2]);
  });

  it("lets only as many people absorb the remainder as there are leftover rupiah", () => {
    expect(splitEqually(7, 5)).toEqual([2, 2, 1, 1, 1]);
    expect(splitEqually(3, 5)).toEqual([1, 1, 1, 0, 0]);
  });

  it("assigns the whole bill to a single participant", () => {
    expect(splitEqually(1_000, 1)).toEqual([1_000]);
  });

  it("returns zero shares for a zero total", () => {
    expect(splitEqually(0, 2)).toEqual([0, 0]);
  });

  it("returns an empty list when there are no participants", () => {
    expect(splitEqually(1_000, 0)).toEqual([]);
  });

  it("always produces integer shares that sum to the total", () => {
    for (let total = 0; total <= 50; total++) {
      for (let count = 1; count <= 7; count++) {
        const shares = splitEqually(total, count);
        expect(shares).toHaveLength(count);
        expect(shares.every(Number.isInteger)).toBe(true);
        expect(sumShares(shares)).toBe(total);
      }
    }
  });
});

describe("sumShares", () => {
  it("adds up all shares", () => {
    expect(sumShares([1_000, 2_500, 500])).toBe(4_000);
    expect(sumShares([])).toBe(0);
  });
});

describe("getRemainingToAssign", () => {
  it("returns zero when shares cover the total", () => {
    expect(getRemainingToAssign(150_000, [75_000, 75_000])).toBe(0);
  });

  it("returns the unassigned amount when shares fall short", () => {
    expect(getRemainingToAssign(150_000, [50_000, 50_000])).toBe(50_000);
  });

  it("returns a negative amount when shares exceed the total", () => {
    expect(getRemainingToAssign(150_000, [100_000, 75_000])).toBe(-25_000);
  });
});

describe("isSplitBalanced", () => {
  it("is true only when the shares sum exactly to the total", () => {
    expect(isSplitBalanced(150_000, [75_000, 75_000])).toBe(true);
    expect(isSplitBalanced(150_000, [74_999, 75_000])).toBe(false);
    expect(isSplitBalanced(150_000, [75_001, 75_000])).toBe(false);
  });
});

describe("formatSplitSummary", () => {
  it("formats the bill total and each person's share on its own line", () => {
    expect(
      formatSplitSummary("Test Mart", 150_000, [
        { name: "Alice", share: 75_000 },
        { name: "Bob", share: 75_000 },
      ])
    ).toBe(
      ["Test Mart — Rp150.000,00", "Alice: Rp75.000,00", "Bob: Rp75.000,00"].join(
        "\n"
      )
    );
  });

  it("uses the provided display names and formatted amounts", () => {
    expect(
      formatSplitSummary("Warung", 1_000, [
        { name: "Person 1", share: 334 },
        { name: "Person 2", share: 333 },
        { name: "Person 3", share: 333 },
      ])
    ).toBe(
      [
        `Warung — ${formatIDRDisplay(1_000)}`,
        `Person 1: ${formatIDRDisplay(334)}`,
        `Person 2: ${formatIDRDisplay(333)}`,
        `Person 3: ${formatIDRDisplay(333)}`,
      ].join("\n")
    );
  });
});
