import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TransactionType } from "../type/TransactionType";

type State = {
  items: TransactionType[];
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setItems: (items: TransactionType[]) => void
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void
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
    isLoading: false,
    error: null,

    setItems: (items: TransactionType[]) => {
      set((prev) => {
        prev.items = items;
      })
    },

    setLoading: (loading: boolean) => {
      set((prev) => {
        prev.isLoading = loading;
      })
    },

    setError: (error: string | null) => {
      set((prev) => {
        prev.error = error;
        prev.isLoading = false;
      })
    },

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
        if (index > -1) {
          Object.assign(index, updateditem);
        }
      });
    },

    

  }))
);

export default useTransaction;
