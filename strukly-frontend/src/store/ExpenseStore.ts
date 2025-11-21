import axios from "axios";
import useSWR from "swr";
import { Fetcher } from "../fetcher/Fetcher";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ExpenseType } from "../type/ExpenseType";

type State = {
  items: ExpenseType[];
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setItems: (items: ExpenseType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addExpense: (item: ExpenseType) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (
    id: string,
    updateditem: Partial<Omit<ExpenseType, "id">> //avoiding id to being changed
  ) => void;
};

const useExpense = create<State & Actions>()(
  immer((set) => ({
    //initial state
    items: [],
    isLoading: false,
    error: null,

    //load all the fetched data into state
    setItems: (items: ExpenseType[]) => {
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

    //adding new expense
    addExpense: (item: ExpenseType) => {
      set((prev) => {
        prev.items.push(item);
      });
    },

    //delete existing expense
    deleteExpense: (id: string) => {
      set((prev) => {
        const index = prev.items.findIndex((item) => item.id === id);
        if (index > -1) {
          prev.items.splice(index, 1);
        }
      });
    },

    //uodate existing expense
    updateExpense: (
      id: string,
      updateditem: Partial<Omit<ExpenseType, "id">> //id cant be modified
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

//to fetch & load the expense datas
export function loadExpense(month: number, year: number) {
  const { data, error, isLoading } = useSWR<ExpenseType[]>(
    `http://localhost:3000/api/expenses?month=${month}&week=${year}`,
    Fetcher<ExpenseType[]>
  );
  const { setItems, setError, setLoading } = useExpense();

  setLoading(isLoading);
  if (error) setError("Failed to fetch expense");
  if (data) setItems(data);
}

// post a new expense
export async function postExpense(expense: ExpenseType) {
  const { addExpense } = useExpense();
  try {
    await axios.post("http://localhost:3000/api/expenses", expense);
    addExpense(expense);
  } catch (error) {
    console.error("Failed to post expense:", error);
    throw error; // rethrow so caller can handle it
  }
}

export async function putExpense(
  id: string, //expense id
  expense: Partial<Omit<ExpenseType, "id">>
) {
  const { updateExpense } = useExpense();
  try {
    await axios.put(`http://localhost:3000/api/expense/${id}`, expense);
    updateExpense(id, expense);
  } catch (error) {
    console.error("Failed to put expense:", error);
    throw error; // rethrow so caller can handle it
  }
}

export async function deleteExpense(id: string) {
  try {
    const {} = useExpense();
    await axios.delete(`http://localhost:3000/api/expense/${id}`);
  } catch (error) {
    console.error("Failed to put expense:", error);
    throw error; // rethrow so caller can handle it
  }
}

export default useExpense;
