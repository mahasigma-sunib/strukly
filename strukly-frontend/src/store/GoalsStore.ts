import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GoalItem } from "../type/GoalItem";

type State = {
  items: GoalItem[];
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setItems: (items: GoalItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addGoal: (item: GoalItem) => void;
  deleteGoal: (id: string) => void;
  depositGoal: (id: string, addDepositAmount: number) => void;
  updateGoal: (id: string, newName: string, newPrice: number) => void;
};

const useGoals = create<State & Actions>()(
  immer((set) => ({
    items: [],
    isLoading: false,
    error: null,

    setItems: (items: GoalItem[]) => {
      set((prev) => {
        prev.items = items;
      });
    },

    setLoading: (loading: boolean) => {
      set((prev) => {
        prev.isLoading = loading;
      });
    },

    setError: (error: string | null) => {
      set((prev) => {
        prev.error = error;
        prev.isLoading = false;
      });
    },

    addGoal: (item: GoalItem) => {
      set((prev) => {
        prev.items.push(item);
      });
    },

    deleteGoal: (id: string) => {
      set((prev) => {
        const idx = prev.items.findIndex((item) => item.id === id);
        if (idx > -1) {
          prev.items.splice(idx, 1);
        }
      });
    },

    depositGoal: (id: string, addDepositAmount: number) => {
      set((prev) => {
        const idx = prev.items.findIndex((item) => item.id === id);
        if (idx > -1) {
          prev.items[idx].deposit += addDepositAmount;
        }
      });
    },
    updateGoal: (id: string, newName: string, newPrice: number) => {
      set((prev) => {
        const idx = prev.items.findIndex((item) => item.id === id);
        if (idx > -1) {
          prev.items[idx].name = newName;
          prev.items[idx].price = newPrice;
        }
      });
    },
  }))
);
export default useGoals;
