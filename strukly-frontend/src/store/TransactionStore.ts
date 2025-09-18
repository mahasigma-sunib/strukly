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
    items: [],
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
