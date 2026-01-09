import { useEffect } from "react";
import useSWR from "swr";

import useGoals from "../store/GoalsStore";
import type { GoalItem } from "../type/GoalItem";

export function mapGoal(raw: any): GoalItem {
  return {
    id: raw.id,
    name: raw.name,
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
    (url) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );

  useEffect(() => {
    setLoading(isLoading);

    if (error) {
      setError("Failed to fetch expenses");
    }

    if (data?.goalItems) {
      const mapped = data.goalItems
        .map(mapGoal)
        .sort(
          (a: GoalItem, b: GoalItem) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      setItems(mapped);
    }
  }, [isLoading, error, data]);

  return { data, error, isLoading };
}
