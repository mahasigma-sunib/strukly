import axios from "axios";
// import useSWR from "swr";
// import { Fetcher } from "../fetcher/Fetcher";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WalletType } from "../type/WalletType";

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
    //initial state
    items: [],
    isLoading: false,
    error: null,

    //load all the fetched data into state
    setItems: (items: WalletType[]) => {
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
      });
    },

    //adding new wallet
    addWallet: (item: WalletType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },

    //delete an existing wallet
    deleteWallet: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.splice(index, 1);
        }
      });
    },

    //update existing wallet
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

//to fetch & load the wallet data
// export function loadWallet() {
//   const { data, error, isLoading } = useSWR<WalletType[]>(
//     "api here",
//     Fetcher<WalletType[]>
//   );
//   const { setItems, setError, setLoading } = useWallet();

//   setLoading(isLoading);
//   if (error) setError("Failed to fetch transaction");
//   if (data) setItems(data);
// }

//post a new wallet
export async function postWallet(wallet: WalletType) {
  const { addWallet } = useWallet();
  try {
    await axios.post("http://localhost:3000/api/wallet/add", wallet);
    addWallet(wallet);
  } catch (error) {
    console.error("Failed to post wallet:", error);
    throw error; // rethrow so caller can handle it
  }
}


export default useWallet;
