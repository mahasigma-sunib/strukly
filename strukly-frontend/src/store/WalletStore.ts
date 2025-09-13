import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WalletType } from "../type/WalletType";

type State = {
  items: WalletType[];
};

type Actions = {
  addWallet: (item: WalletType) => void;
  deleteWallet: (id: string) => void;
  updateWallet: (
    id: string,
    updateditem: Partial<Omit<WalletType, "id">>
  ) => void;
};

const useWallet = create<State & Actions>()(
  immer((set) => ({
    items: [
      {
        id: "wal_1a2b3c4d", // String ID
        name: "Main Wallet",
        balance: 1250.75,
      },
      {
        id: "wal_5e6f7g8h", // String ID
        name: "Savings Account",
        balance: 5000.0,
      },
      {
        id: "wal_9i0j1k2l", // String ID
        name: "Investment Fund",
        balance: 875.2,
      },
      {
        id: "wal_3m4n5o6p", // String ID
        name: "Travel Budget",
        balance: 250.0,
      },
      {
        id: "wal_7q8r9s0t", // String ID
        name: "Grocery Fund",
        balance: 45.3,
      },
    ],
    
    addWallet: (item: WalletType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },
    deleteWallet: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.splice(index, 1);
        }
      });
    },

    updateWallet: (
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
export default useWallet;
