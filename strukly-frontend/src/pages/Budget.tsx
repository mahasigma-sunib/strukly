// import { useState } from "react";
import useSWR from "swr";

// GET localhost:3000/api/budget

type Fetcher = <T = unknown>(...args: Parameters<typeof fetch>) => Promise<T>;

const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include", // This is the key part
    // You may also need to set the mode to 'cors' if necessary
    mode: "cors",
  });

  // Handle non-ok responses (e.g., 401 Unauthorized)
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

// {
//   "month": 0,
//   "year": 0,
//   "budget": 0,
//   "unusedBudget": 0
// }

type GetBudgetResponse = {
  month: number;
  year: number;
  budget: number;
  unusedBudget: number;
};

export default function ExpenseBudget() {
  const {
    data: budgetData,
    error,
    isLoading,
  } = useSWR<GetBudgetResponse>("http://localhost:3000/api/budget", fetcher);

  const unusedBudget = 121;

  return (
    <div className="">
      <div>Budget</div>
      <div>
        {budgetData && <div>{budgetData?.budget}</div>}
        {!budgetData && isLoading && <div>Loading...</div>}
        {error && <div>Error loading budget data</div>}
        <div className="">Unused Budget</div>
        <div>{unusedBudget}</div>
        <button onClick={() => {}}>add +10 to current budget</button>
      </div>
    </div>
  );
}
