import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TransactionType } from "../type/TransactionType";

type State = {
  items: TransactionType[];
};

type Actions = {
  addTransaction: (item: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (
    id: string,
    updateditem: Partial<Omit<TransactionType, "id">>
  ) => void;
};

const useTransaction = create<State & Actions>()(
  immer((set) => ({
    items: [
      {
        id: "tx-abc-1",
        categoryId: "groceries", // Synchronized with a category ID
        walletId: "wallet-main",
        date: new Date("2025-09-14T11:20:00Z"),
        items: [
          {
            itemName: "Milk",
            quantity: 1,
            singleItemPrice: 2.5,
            totalPrice: 2.5,
          },
          {
            itemName: "Bread",
            quantity: 1,
            singleItemPrice: 3.0,
            totalPrice: 3.0,
          },
          {
            itemName: "Eggs",
            quantity: 1,
            singleItemPrice: 4.5,
            totalPrice: 4.5,
          },
        ],
        tax: 0.6,
        serviceCharge: 0.0,
        total: 10.6, // (2.50+3.00+4.50) + 0.60 + 0.00
      },
      {
        id: "tx-def-2",
        categoryId: "salary", // Synchronized with a category ID
        walletId: "wallet-main",
        date: new Date("2025-09-13T09:00:00Z"),
        items: [
          {
            itemName: "Paycheck",
            quantity: 1,
            singleItemPrice: 2500.0,
            totalPrice: 2500.0,
          },
        ],
        tax: 0.0,
        serviceCharge: 0.0,
        total: 2500.0,
      },
      {
        id: "tx-ghi-3",
        categoryId: "restaurants", // Synchronized with a category ID
        walletId: "wallet-credit-card",
        date: new Date("2025-09-12T19:30:00Z"),
        items: [
          {
            itemName: "Dinner",
            quantity: 1,
            singleItemPrice: 42.0,
            totalPrice: 42.0,
          },
        ],
        tax: 2.52,
        serviceCharge: 0.45,
        total: 44.97, // 42.00 + 2.52 + 0.45
      },
      {
        id: "tx-jkl-4",
        categoryId: "freelance", // Synchronized with a category ID
        walletId: "wallet-freelance",
        date: new Date("2025-09-11T14:00:00Z"),
        items: [
          {
            itemName: "Client Payment",
            quantity: 1,
            singleItemPrice: 500.0,
            totalPrice: 500.0,
          },
        ],
        tax: 0.0,
        serviceCharge: 0.0,
        total: 500.0,
      },
    ],
    addTransaction: (item: TransactionType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },
    deleteTransaction: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.splice(index, 1);
        }
      });
    },
    updateTransaction: (
      id: string,
      updateditem: Partial<Omit<TransactionType, "id">>
    ) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index) {
          Object.assign(index, updateditem);
        }
      });
    },
  }))
);

export default useTransaction;
