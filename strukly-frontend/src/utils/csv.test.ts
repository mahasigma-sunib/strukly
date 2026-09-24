import { describe, expect, it } from "vitest";
import {
  EXPENSE_CSV_HEADER,
  buildExpensesCsv,
  buildExpensesCsvFilename,
  escapeCsvField,
  formatCsvDate,
  formatCsvTime,
  formatItemsSummary,
} from "./csv";
import type { ExpenseType } from "../type/ExpenseType";

function makeExpense(overrides: Partial<ExpenseType> = {}): ExpenseType {
  return {
    userID: "user",
    id: "expense-1",
    dateTime: new Date(2026, 8, 15, 14, 30),
    vendorName: "Store",
    category: "others",
    currency: "Rp ",
    subtotalAmount: 1000,
    taxAmount: 0,
    discountAmount: 0,
    serviceAmount: 0,
    totalAmount: 1000,
    items: [],
    ...overrides,
  };
}

describe("escapeCsvField", () => {
  it("leaves plain fields unchanged", () => {
    expect(escapeCsvField("Coffee")).toBe("Coffee");
    expect(escapeCsvField("15000")).toBe("15000");
  });

  it("quotes fields containing commas", () => {
    expect(escapeCsvField("Tokyo, Japan")).toBe('"Tokyo, Japan"');
  });

  it("doubles internal quotes and wraps the field", () => {
    expect(escapeCsvField('Say "hi"')).toBe('"Say ""hi"""');
  });

  it("quotes fields containing newlines", () => {
    expect(escapeCsvField("line1\nline2")).toBe('"line1\nline2"');
    expect(escapeCsvField("line1\r\nline2")).toBe('"line1\r\nline2"');
  });
});

describe("formatCsvDate and formatCsvTime", () => {
  it("formats local date as YYYY-MM-DD with zero padding", () => {
    expect(formatCsvDate(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(formatCsvDate(new Date(2026, 8, 15))).toBe("2026-09-15");
  });

  it("formats local time as 24h HH:mm with zero padding", () => {
    expect(formatCsvTime(new Date(2026, 8, 15, 9, 5))).toBe("09:05");
    expect(formatCsvTime(new Date(2026, 8, 15, 23, 59))).toBe("23:59");
    expect(formatCsvTime(new Date(2026, 8, 15, 0, 0))).toBe("00:00");
  });
});

describe("formatItemsSummary", () => {
  it("returns an empty string when there are no items", () => {
    expect(formatItemsSummary([])).toBe("");
  });

  it("joins item summaries with semicolons", () => {
    expect(
      formatItemsSummary([
        {
          expenseID: "expense-1",
          id: "item-1",
          name: "Coffee",
          quantity: 2,
          singleItemPrice: 15000,
          totalPrice: 30000,
        },
        {
          expenseID: "expense-1",
          id: "item-2",
          name: "Cake",
          quantity: 1,
          singleItemPrice: 20000,
          totalPrice: 20000,
        },
      ])
    ).toBe("2x Coffee @15000; 1x Cake @20000");
  });
});

describe("buildExpensesCsv", () => {
  it("writes the header row and one row per expense", () => {
    const csv = buildExpensesCsv([makeExpense()]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(EXPENSE_CSV_HEADER);
    expect(lines[1]).toBe("2026-09-15,14:30,Store,others,Rp,1000,0,0,0,1000,");
  });

  it("sorts rows by dateTime ascending", () => {
    const csv = buildExpensesCsv([
      makeExpense({
        id: "late",
        vendorName: "Late",
        dateTime: new Date(2026, 8, 20, 10, 0),
      }),
      makeExpense({
        id: "early",
        vendorName: "Early",
        dateTime: new Date(2026, 8, 1, 8, 0),
      }),
    ]);
    const lines = csv.split("\n");
    expect(lines[1]).toContain("Early");
    expect(lines[2]).toContain("Late");
  });

  it("escapes fields and writes raw item summaries", () => {
    const csv = buildExpensesCsv([
      makeExpense({
        vendorName: 'Best, "Store"',
        subtotalAmount: 15000.5,
        taxAmount: 1000,
        serviceAmount: 500,
        discountAmount: 250,
        totalAmount: 15750.5,
        items: [
          {
            expenseID: "expense-1",
            id: "item-1",
            name: "Coffee, large",
            quantity: 2,
            singleItemPrice: 15000,
            totalPrice: 30000,
          },
        ],
      }),
    ]);
    const lines = csv.split("\n");
    expect(lines[1]).toBe(
      '2026-09-15,14:30,"Best, ""Store""",others,Rp,15000.5,1000,500,250,15750.5,"2x Coffee, large @15000"'
    );
  });
});

describe("buildExpensesCsvFilename", () => {
  it("names the file after the viewed year and month", () => {
    expect(buildExpensesCsvFilename(9, 2026)).toBe("koinku-expenses-2026-09.csv");
    expect(buildExpensesCsvFilename(1, 2026)).toBe("koinku-expenses-2026-01.csv");
  });
});
