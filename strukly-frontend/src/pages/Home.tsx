import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Card from "../components/card/Card";
import ProgressBar from "../components/graph/ProgressBar";
import ExpenseList from "../components/card/ExpenseListCard";
import ExpenseEmptyMascot from "../components/mascots/ExpenseEmptyMascot";
import useUserAuth from "../store/UserAuthStore";
import useExpense, { useLoadExpense } from "../store/ExpenseStore";
import type BudgetType from "../type/BudgetType";
import GoalsIconFilled from "../components/icons/GoalsIconFilled";

function Home() {
  const navigate = useNavigate();
  const username = useUserAuth((s) => s.user?.name || "User");

  // Date Logic
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  const currentMonthYear = today.toLocaleDateString('en-US', options);
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Fetch Expenses
  useLoadExpense(currentMonth, currentYear, true);
  const { items: expenses, isLoading: isExpenseLoading } = useExpense();

  // Fetch Budget
  const { data: budgetData } = useSWR<BudgetType>(
    `${import.meta.env.VITE_API_BASE_URL}/budget`,
    (url: string) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );

  // Top 3 Recent Transactions
  const recentTransactions = useMemo(() => {
    // Clone to avoid mutating store array if it's not immutable
    return [...expenses]
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      .slice(0, 3);
  }, [expenses]);

  // Financial Overview Calculations
  const totalBudget = budgetData?.budget || 0;

  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
  }, [expenses]);

  const remainingBudget = totalBudget - totalSpent;

  // Mock Goals Data
  const goals = [
    { id: 1, name: "New Laptop", target: 20000000, current: 15000000, color: "text-blue-500", barColor: "bg-blue-500" },
    { id: 2, name: "Japan Trip", target: 30000000, current: 5000000, color: "text-pink-500", barColor: "bg-pink-500" },
    { id: 3, name: "Emergency Fund", target: 50000000, current: 12000000, color: "text-orange-500", barColor: "bg-orange-500" },
  ];

  const formatMoney = (n: number) =>
    `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(n || 0))}`;

  return (
    <div className="min-h-screen pb-24 px-5">
      {/* Header / Greeting */}
      <div className="pt-8 mb-6">
        <p className="text-text-secondary text-lg font-medium">Welcome back,</p>
        <h1 className="text-3xl font-bold text-text-primary">{username}</h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold bg-surface px-3 py-1 rounded-full border border-border">
            {currentMonthYear}
          </span>
        </div>
      </div>

      {/* Financial Overview Card */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-text-primary">Monthly Overview</h2>
        </div>

        <Card size="lg" className="bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] text-white shadow-xl !p-6 border-none">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold">{formatMoney(totalSpent)}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Budget Limit</span>
                <span className="font-semibold">{formatMoney(totalBudget)}</span>
              </div>
              <ProgressBar
                value={totalSpent}
                max={totalBudget > 0 ? totalBudget : 1}
                height={10}
                className="!bg-gray-700" // Override background
              />
              <div className="flex justify-end text-sm mt-1">
                <span className={remainingBudget < 0 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                  {remainingBudget < 0 ? "Over Budget: " : "Remaining: "}
                  {formatMoney(Math.abs(remainingBudget))}
                </span>
              </div>
              {totalBudget === 0 && (
                <p className="text-xs text-yellow-400 italic">No budget set for this month.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Goals Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-text-primary">My Goals</h2>
          {/* <button className="text-sm text-primary font-semibold">See All</button> */}
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400">You have not made any goals</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-full bg-opacity-10 ${goal.color.replace('text', 'bg')}`}>
                  <GoalsIconFilled className={`w-6 h-6 ${goal.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-text-primary text-sm">{goal.name}</span>
                    <span className="text-xs font-bold text-text-secondary">{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${goal.barColor.replace('bg-', 'bg-')}`} // Ensuring tailwind picks it up, simplified logic could be just specific class
                      style={{ width: `${(goal.current / goal.target) * 100}%`, backgroundColor: goal.color.includes('blue') ? '#3b82f6' : goal.color.includes('pink') ? '#ec4899' : '#f97316' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <span>{formatMoney(goal.current)}</span>
                    <span className="text-gray-400">Target: {formatMoney(goal.target)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-text-primary">Recent History</h2>
          <button onClick={() => navigate('/expense')} className="text-sm text-[var(--fun-color-primary)] font-bold">See All</button>
        </div>

        <div className="flex flex-col gap-3">
          {recentTransactions.length === 0 && !isExpenseLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 bg-surface rounded-2xl border border-border">
              <div className="w-20 h-20 opacity-50">
                <ExpenseEmptyMascot />
              </div>
              <p className="text-text-secondary font-medium">No recent transactions</p>
            </div>
          ) : (
            recentTransactions.map((item) => (
              <Card
                key={item.id}
                size="md"
                className="bg-[#EFF4FA] shadow-[0_4px_0_0_#D9E8F5] !border-none active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/expense/${item.id}`)}
              >
                <ExpenseList
                  vendorName={item.vendorName}
                  date={new Date(item.dateTime)}
                  currency={item.currency}
                  amount={item.totalAmount.toString()}
                  category={item.category}
                />
              </Card>
            ))
          )}
          {isExpenseLoading && <div className="text-center py-4 text-gray-400">Loading transactions...</div>}
        </div>
      </div>
    </div>
  );
}

export default Home;
