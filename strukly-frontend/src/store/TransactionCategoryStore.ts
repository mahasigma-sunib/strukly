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
  updateBalance: (id: string, newBalance: number) => void;
};

const useTransactionCategory = create<State & Actions>()(
  immer((set) => ({
    items: [
      {
        id: "exp_cat_1a2b3c4d",
        categoryName: "Groceries",
        balance: 350.5,
      },
      {
        id: "exp_cat_5e6f7g8h",
        categoryName: "Utilities",
        balance: 150.0,
      },
      {
        id: "exp_cat_9i0j1k2l",
        categoryName: "Restaurants",
        balance: 75.25,
      },
      {
        id: "exp_cat_3m4n5o6p",
        categoryName: "Transportation",
        balance: 50.0,
      },
      {
        id: "exp_cat_7q8r9s0t",
        categoryName: "Entertainment",
        balance: 120.0,
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

    updateBalance: (id: string, newBalance: number) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items[index].balance = newBalance;
        }
      });
    },
  }))
);

export default useTransactionCategory;
