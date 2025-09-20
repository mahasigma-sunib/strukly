import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WalletType } from "../type/WalletType";
import useSWR from "swr";
import { Fetcher } from "../fetcher/Fetcher";

type State = {
  items: WalletType[];
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setItems: (items: WalletType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
    isLoading: false,
    error: null,

    setItems: (items: WalletType[]) => {
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
      });
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

export function loadWallet() {
  const { data, error, isLoading } = useSWR<WalletType[]>(
    "api here",
    Fetcher<WalletType[]>
  );
  const { setItems, setError, setLoading } = useWallet();

  setLoading(isLoading);
  if (error) setError("Failed to fetch transaction");
  if (data) setItems(data);
}

export default useWallet;
