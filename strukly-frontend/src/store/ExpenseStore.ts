import axios from "axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ExpenseType } from "../type/ExpenseType";
import type { ExpenseStatisticType } from "../type/expenseStatisticType";

type State = {
  statistic: ExpenseStatisticType;
  items: ExpenseType[];
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setStats: (stat: ExpenseStatisticType) => void;
  setItems: (items: ExpenseType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addExpense: (item: ExpenseType) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (
    id: string,
    updateditem: Partial<Omit<ExpenseType, "id">> //avoiding id to being changed
  ) => void;
};

const useExpense = create<State & Actions>()(
  immer((set) => ({
    //initial state
    statistic: { month: -1, year: -1, weekly: [], total: 0 },
    items: [],
    isLoading: false,
    error: null,

    //load all the fetched data into state
    setStats: (stat: ExpenseStatisticType) => {
      set((prev) => {
        prev.statistic = stat;
      });
    },

    setItems: (items: ExpenseType[]) => {
      set((prev) => {
        prev.items = items;
      });
    },

    //request status
    setLoading: (loading: boolean) => {
      set((prev) => {
        prev.isLoading = loading;
      });
    },

    //error message
    setError: (error: string | null) => {
      set((prev) => {
        prev.error = error;
        prev.isLoading = false;
      });
    },

    //adding new expense
    addExpense: (item: ExpenseType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },

    //delete existing expense
    deleteExpense: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.splice(index, 1);
        }
      });
    },

    //uodate existing expense
    updateExpense: (
      id: string,
      updateditem: Partial<Omit<ExpenseType, "id">> //id cant be modified
    ) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          Object.assign(prev.items[index], updateditem);
        }
      });
    },
  }))
);
export default useExpense;

