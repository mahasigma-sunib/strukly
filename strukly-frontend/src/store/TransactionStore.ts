import axios from "axios";
import useSWR from "swr";
import { Fetcher } from "../fetcher/Fetcher";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TransactionType } from "../type/TransactionType";

type State = {
  items: TransactionType[];
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setItems: (items: TransactionType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addTransaction: (item: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (
    id: string,
    updateditem: Partial<Omit<TransactionType, "id">> //avoiding id to being changed
  ) => void;
};

const useTransaction = create<State & Actions>()(
  immer((set) => ({
    //initial state
    items: [],
    isLoading: false,
    error: null,

    //load all the fetched data into state
    setItems: (items: TransactionType[]) => {
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
        prev.isLoading = false;
      });
    },

    //adding new transaction
    addTransaction: (item: TransactionType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },

    //delete existing transaction
    deleteTransaction: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.splice(index, 1);
        }
      });
    },

    //uodate existing transaction
    updateTransaction: (
      id: string,
      updateditem: Partial<Omit<TransactionType, "id">> //id cant be modified
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

//to fetch & load the transaction datas
export function loadTransaction() {
  const { data, error, isLoading } = useSWR<TransactionType[]>(
    "api here",
    Fetcher<TransactionType[]>
  );
  const { setItems, setError, setLoading } = useTransaction();

  setLoading(isLoading);
  if (error) setError("Failed to fetch transaction");
  if (data) setItems(data);
}

// post a new transaction
export async function postTransaction(transaction: TransactionType) {
  const { addTransaction } = useTransaction();
  try {
    await axios.post("http://localhost:3000/api/transaction/add", transaction);
    addTransaction(transaction);
  } catch (error) {
    console.error("Failed to post transaction:", error);
    throw error; // rethrow so caller can handle it
  }
}

export async function putTransaction(
  id: string,
  transaction: Partial<Omit<TransactionType, "id">>
) {
  const { updateTransaction } = useTransaction();
  try {
    await axios.put(`http://localhost:3000/api/transaction/${id}`, transaction);
    updateTransaction(id, transaction);
  } catch (error) {
    console.error("Failed to put transaction:", error);
    throw error; // rethrow so caller can handle it
  }
}

export async function deleteTransaction(id: string) {
  try {
    const {} = useTransaction();
    await axios.delete(`http://localhost:3000/api/transaction/${id}`);
  } catch (error) {
    console.error("Failed to put transaction:", error);
    throw error; // rethrow so caller can handle it
  }
}

export default useTransaction;
