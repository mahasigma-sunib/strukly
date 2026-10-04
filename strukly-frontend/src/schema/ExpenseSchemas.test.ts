import { describe, expect, it } from "vitest";
import {
  TIME_INVALID,
  formatTime,
  getExpenseFormErrors,
  parseTimeInput,
} from "./ExpenseSchemas";

describe("parseTimeInput", () => {
  it("parses HH:mm and H:mm separated input", () => {
    expect(parseTimeInput("23:59")).toEqual({ hours: 23, minutes: 59 });
    expect(parseTimeInput("9:5")).toEqual({ hours: 9, minutes: 5 });
  });

  it("parses dot separated input", () => {
    expect(parseTimeInput("23.59")).toEqual({ hours: 23, minutes: 59 });
  });

  it("parses compact digit input", () => {
    expect(parseTimeInput("0930")).toEqual({ hours: 9, minutes: 30 });
    expect(parseTimeInput("930")).toEqual({ hours: 9, minutes: 30 });
    expect(parseTimeInput("0030")).toEqual({ hours: 0, minutes: 30 });
  });

  it("parses bare hours as zero minutes", () => {
    expect(parseTimeInput("9")).toEqual({ hours: 9, minutes: 0 });
    expect(parseTimeInput("23")).toEqual({ hours: 23, minutes: 0 });
  });

  it("rejects out-of-range and malformed input", () => {
    expect(parseTimeInput("24:00")).toBeNull();
    expect(parseTimeInput("25:61")).toBeNull();
    expect(parseTimeInput("99:99")).toBeNull();
    expect(parseTimeInput("24")).toBeNull();
    expect(parseTimeInput("12:60")).toBeNull();
    expect(parseTimeInput("9:30 PM")).toBeNull();
    expect(parseTimeInput("")).toBeNull();
    expect(parseTimeInput("   ")).toBeNull();
  });

  it("normalizes with zero padding", () => {
    expect(formatTime(9, 5)).toBe("09:05");
    expect(formatTime(23, 59)).toBe("23:59");
  });
});

describe("getExpenseFormErrors time validation", () => {
  const validExpense = {
    vendorName: "Store",
    items: [{ name: "Item", singleItemPrice: 1000, quantity: 1 }],
    subtotalAmount: 1000,
    taxAmount: 0,
    discountAmount: 0,
    serviceAmount: 0,
    totalAmount: 1000,
  };

  it("accepts valid 24-hour time text", () => {
    expect(getExpenseFormErrors(validExpense, "18:30").time).toBeUndefined();
    expect(getExpenseFormErrors(validExpense, "0930").time).toBeUndefined();
    expect(getExpenseFormErrors(validExpense, "23.59").time).toBeUndefined();
  });

  it("rejects invalid or out-of-range time text", () => {
    expect(getExpenseFormErrors(validExpense, "24:00").time).toBe(
      TIME_INVALID
    );
    expect(getExpenseFormErrors(validExpense, "25:61").time).toBe(TIME_INVALID);
    expect(getExpenseFormErrors(validExpense, "").time).toBe(TIME_INVALID);
  });

  it("skips time validation when no time text is given", () => {
    expect(getExpenseFormErrors(validExpense).time).toBeUndefined();
    expect(getExpenseFormErrors(validExpense, undefined).time).toBeUndefined();
  });

  it("blocks submit alongside other errors", () => {
    const errors = getExpenseFormErrors(
      { ...validExpense, vendorName: "" },
      "99:99"
    );
    expect(errors.time).toBe(TIME_INVALID);
    expect(errors.vendorName).toBeTruthy();
  });
});
