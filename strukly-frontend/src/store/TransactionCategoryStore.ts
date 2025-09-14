import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TransactionCategoryType } from "../type/TransactionCategoryType";

type State = {
  items: TransactionCategoryType[];
};

type Actions = {
  addTransactionCategory: (item: TransactionCategoryType) => void;
  deleteTransactionCategory: (id: string) => void;
  updateName: (id: string, newName: string) => void;
  updateAmount: (id: string, newAmount: number) => void;
};

const useTransactionCategory = create<State & Actions>()(
  immer((set) => ({
    items: [
      {
        id: "groceries",
        categoryName: "Groceries",
        amount: 85.5,
        type: "expense",
      },
      {
        id: "salary",
        categoryName: "Salary",
        amount: 2500.0,
        type: "income",
      },
      {
        id: "restaurants",
        categoryName: "Restaurants",
        amount: 45.0,
        type: "expense",
      },
      {
        id: "freelance",
        categoryName: "Freelance Work",
        amount: 500.0,
        type: "income",
      },
    ],

    addTransactionCategory: (item: TransactionCategoryType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },

    deleteTransactionCategory: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.slice(index, 1);
        }
      });
    },

    updateName: (id: string, newName: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items[index].categoryName = newName;
        }
      });
    },

    updateAmount: (id: string, newAmount: number) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items[index].amount = newAmount;
        }
      });
    },
  }))
);

export default useTransactionCategory;
