import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { useLoadExpense } from "../hooks/useLoadExpense";
import ExpenseTracker from "./ExpenseTracker";

const mockStore = vi.hoisted(() => ({ error: null as string | null }));
vi.mock("../hooks/useLoadExpense", () => ({ useLoadExpense: vi.fn() }));
vi.mock("../store/ExpenseStore", () => ({
  default: () => ({
    items: [
      {
        userID: "user",
        id: "previous-expense",
        dateTime: new Date(2025, 0, 1),
        vendorName: "Previous month purchase",
        category: "others",
        currency: "Rp ",
        subtotalAmount: 100,
        taxAmount: 0,
        discountAmount: 0,
        serviceAmount: 0,
        totalAmount: 100,
        items: [],
      },
    ],
    statistic: { month: 1, year: 2025, weekly: [], total: 100 },
    error: mockStore.error,
    isLoading: false,
  }),
}));

function renderTracker() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <ExpenseTracker />
    </MemoryRouter>
  );
}

describe("ExpenseTracker load failures", () => {
  beforeEach(() => {
    mockStore.error = null;
    vi.mocked(useLoadExpense).mockReturnValue({
      data: undefined,
      error: new Error("Request failed"),
      isLoading: false,
    });
  });

  it("shows Retry rather than cached expenses when a refresh fails", () => {
    vi.mocked(useLoadExpense).mockReturnValue({
      data: { history: [{ id: "previous-expense" }] },
      error: new Error("Request failed"),
      isLoading: false,
    });
    const html = renderTracker();
    expect(html).toContain("Retry");
    expect(html).not.toContain("Previous month purchase");
  });

  it("shows Retry rather than another month's expenses when a filter request fails", () => {
    mockStore.error = "Failed to fetch expenses";
    const html = renderTracker();
    expect(html).toContain("Retry");
    expect(html).not.toContain("Previous month purchase");
  });
});
