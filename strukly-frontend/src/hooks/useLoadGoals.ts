import { useEffect } from "react";
import useSWR from "swr";

import useGoals from "../store/GoalsStore";
import { fetcher } from "../utils/fetcher";
import type { GoalItem } from "../type/GoalItem";
import type { CategoryKey } from "../utils/CategoryConfig";

export function mapGoal(raw: any): GoalItem {
  return {
    id: raw.id,
    name: raw.name,
    category: (raw.category || "others") as CategoryKey,
    price: raw.price,
    deposit: raw.deposited,
    isCompleted: raw.completed,
    createdAt: raw.createdAt,
  };
}

export function useLoadGoals() {
  const { setItems, setError, setLoading } = useGoals();

  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_BASE_URL}/goals`,
    fetcher
  );

  useEffect(() => {
    setLoading(isLoading);

    if (error) {
      setError("Failed to fetch goals");
    }

    if (data?.goalItems) {
      const mapped = data.goalItems
        .map(mapGoal)
        .sort(
          (a: GoalItem, b: GoalItem) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      setItems(mapped);
      setError(null);
    }
  }, [isLoading, error, data]);

  return { data, error, isLoading };
}
