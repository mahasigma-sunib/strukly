import useSWR from "swr";
import type BudgetType from "../type/BudgetType";
import { fetcher } from "../utils/fetcher";

export function useLoadBudget() {
  const response = useSWR<BudgetType>(
    `${import.meta.env.VITE_API_BASE_URL}/budget`,
    fetcher
  );
  return {
    data: response.data,
    isLoading: response.isLoading,
    error: response.error,
    mutate: response.mutate,
  };
}