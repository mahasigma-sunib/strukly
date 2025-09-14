import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TransactionType } from "../type/TransactionType";
import type { WalletType } from "../type/WalletType";

type State = {
  items: TransactionType[];
};

type Actions = {
  addTransaction: (item: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (
    id: string,
    updateditem: Partial<Omit<WalletType, "id">>
  ) => void;
};

const useTransaction = create<State & Actions>()(
  immer((set) => ({
    items: [
      {
        id: "uuid-123",
        categoryId: "electronics",
        items: [
          {
            itemName: "Laptop",
            quantity: 1,
            singleItemPrice: 850.0,
            totalPrice: 850.0,
          },
          {
            itemName: "Mouse",
            quantity: 1,
            singleItemPrice: 25.0,
            totalPrice: 25.0,
          },
        ],
        tax: 61.25,
        serviceCharge: 0.0, // Now defaults to 0
        total: 936.25, // Updated total: 850 + 25 + 61.25 + 0
        date: new Date("2024-05-15T10:00:00Z"),
      },
      {
        id: "uuid-456",
        categoryId: "apparel",
        items: [
          {
            itemName: "Coffee Mug",
            quantity: 2,
            singleItemPrice: 12.5,
            totalPrice: 25.0,
          },
          {
            itemName: "T-Shirt (Large)",
            quantity: 1,
            singleItemPrice: 20.0,
            totalPrice: 20.0,
          },
        ],
        tax: 3.94,
        serviceCharge: 0.0, // Now defaults to 0
        total: 48.94, // Updated total: 25 + 20 + 3.94 + 0
        date: new Date("2024-05-14T15:30:00Z"),
      },
      {
        id: "uuid-789",
        categoryId: "books",
        items: [
          {
            itemName: "The Catcher in the Rye",
            quantity: 1,
            singleItemPrice: 15.0,
            totalPrice: 15.0,
          },
        ],
        tax: 1.05,
        serviceCharge: 0.0, // Now defaults to 0
        total: 16.05, // Updated total: 15 + 1.05 + 0
        date: new Date("2024-05-13T09:15:00Z"),
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
      updateditem: Partial<Omit<WalletType, "id">>
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
