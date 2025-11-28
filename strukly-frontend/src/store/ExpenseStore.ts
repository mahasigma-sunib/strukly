import axios from "axios";
import useSWR from "swr";
import { useEffect } from "react";
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

function mapExpense(raw: any): ExpenseType {
  return {
    userID: raw.user_id,

    id: raw.id,
    dateTime: new Date(raw.datetime),
    vendorName: raw.vendor,
    category: raw.category,

    currency: "IDR",
    subtotalAmount: raw.subtotal,
    taxAmount: raw.tax,
    discountAmount: raw.discount,
    serviceAmount: raw.service,
    totalAmount: raw.total_my_expense,

    items: null,
  };
}

//to fetch & load the expense datas
export function useLoadExpense(month: number, year: number) {
  console.log("running");
  const { setItems, setError, setLoading } = useExpense();

  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/api/expenses?month=${month}&year=${year}`,
    (url) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setError("Failed to fetch expenses");
    }
  }, [error]);

  useEffect(() => {
    if (data?.history) {
      const mapped = data.history.map(mapExpense);
      setItems(mapped);
      console.log("mapped:", mapped);
    }
  }, [data]);

  return { data, error, isLoading };
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
