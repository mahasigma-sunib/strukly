import { beforeEach, describe, expect, it, vi } from "vitest";
import useSWR from "swr";
import { useLoadExpense } from "./useLoadExpense";

const store = vi.hoisted(() => ({
  setStats: vi.fn(),
  setItems: vi.fn(),
  setError: vi.fn(),
  setLoading: vi.fn(),
}));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useEffect: (effect: () => void) => effect(),
}));
vi.mock("swr", () => ({ default: vi.fn() }));
vi.mock("../store/ExpenseStore", () => ({ default: () => store }));

describe("useLoadExpense", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps the error when a refresh fails with cached data", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { history: [{ id: "old-expense" }], weekly: [] },
      error: new Error("Request failed"),
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    useLoadExpense(1, 2025, true);

    expect(store.setError).toHaveBeenCalledOnce();
    expect(store.setError).toHaveBeenCalledWith("Failed to fetch expenses");
    expect(store.setItems).not.toHaveBeenCalled();
    expect(store.setStats).not.toHaveBeenCalled();
  });

  it("clears the error when the retry succeeds", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { history: [], weekly: [], total: 0 },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    useLoadExpense(1, 2025, true);

    expect(store.setItems).toHaveBeenCalledWith([]);
    expect(store.setError).toHaveBeenCalledWith(null);
  });
});
