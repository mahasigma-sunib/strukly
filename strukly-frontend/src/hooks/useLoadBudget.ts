import useSWR from "swr";
import type BudgetType from "../type/BudgetType";

export function useLoadBudget() {
  const response = useSWR<BudgetType>(
    `${import.meta.env.VITE_API_BASE_URL}/budget`,
    (url: string) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );
  return {
    data: response.data,
    isLoading: response.isLoading,
    error: response.error,
    mutate: response.mutate,
  };
}