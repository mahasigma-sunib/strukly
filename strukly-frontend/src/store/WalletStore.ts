import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import type { WalletType } from "../type/WalletType";

type State = {
  items: WalletType[];
};

type Actions = {
  fetchWallets: () => Promise<void>;
  addWallet: (item: WalletType) => void;
  deleteWallet: (id: string) => void;
  updateWallet: (
    id: string,
    updateditem: Partial<Omit<WalletType, "id">>
  ) => void;
};

const useWallet = create<State & Actions>()(
  immer((set) => ({
    items: [],

    fetchWallets: async () => {
      try {
        const res = await axios.get("");
        set((prev) => {
          prev.items = res.data;
        });
      } catch (e) {}
    },

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
