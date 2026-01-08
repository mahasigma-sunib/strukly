import { useEffect } from "react";
import useSWR from "swr";

import useExpense from "../store/ExpenseStore";

import type { ExpenseType } from "../type/ExpenseType";
import type { WeeklyStat } from "../type/expenseStatisticType";

export function mapExpense(raw: any): ExpenseType {
  return {
    userID: raw.user_id,

    id: raw.id,
    dateTime: new Date(raw.datetime),
    vendorName: raw.vendor,
    category: raw.category,

    currency: "Rp ",
    subtotalAmount: raw.subtotal,
    taxAmount: raw.tax,
    discountAmount: raw.discount,
    serviceAmount: raw.service,
    totalAmount: raw.total_my_expense,

    items: [],
  };
}

function mapWeeklyStats(raw: any[]): WeeklyStat[] {
  return raw.map((item) => ({
    // name: `Week ${item.week}`,
    name: `${item.startDate}-${item.endDate}`,
    week: item.week,
    spending: item.spending,
    startDate: item.startDate,
    endDate: item.endDate,
  }));
}
//to fetch & load the expense datas
export function useLoadExpense(month: number, year: number, getStat: boolean) {
  // console.log("running");
  const { setStats, setItems, setError, setLoading } = useExpense();

  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_BASE_URL}/expenses?month=${month}&year=${year}`,
    (url) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );

  useEffect(() => {
    setLoading(isLoading);

    if (error) {
      setError("Failed to fetch expenses");
    }

    if (data?.history) {
      const mapped = data.history
        .map(mapExpense)
        .sort(
          (a: ExpenseType, b: ExpenseType) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
      setItems(mapped);
    }

    if (getStat && data?.weekly) {
      const stat = {
        month,
        year,
        weekly: mapWeeklyStats(data.weekly),
        total: data.total,
      };
      // console.log(stat);
      setStats(stat);
    }
  }, [isLoading, error, data]);

  return { data, error, isLoading };
}