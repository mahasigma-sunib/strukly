import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useUserAuth from "../store/UserAuthStore";
import useExpense from "../store/ExpenseStore";
import { useLoadExpense } from "../hooks/useLoadExpense";
import { getCategoryData } from "../utils/CategoryConfig";

import Button from "../components/button/Button";
import Card from "../components/card/Card";
import ExpenseList from "../components/card/ExpenseListCard";
import ProgressBar from "../components/graph/ProgressBar";

import HappyMascot from "../components/mascots/HappyMascot";
import HeadbandMascot from "../components/mascots/HeadbandMascot";
import WinkMascot from "../components/mascots/WinkMascot";

import SettingsIcon from "../components/utilityIcons/SettingsIcon";
import WhistleMascot from "../components/mascots/WhistleMascot";
import { useLoadBudget } from "../hooks/useLoadBudget";
import { useExpenseCalc } from "../hooks/useExpenseCalc";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) {
    return "Morning"; // (04:00 - 10:59)
  } else if (hour >= 11 && hour < 15) {
    return "Afternoon"; // (11:00 - 14:59)
  } else if (hour >= 15 && hour < 19) {
    return "Evening"; // (15:00 - 18:59)
  } else {
    return "Night"; // (19:00 - 03:59)
  }
};

//THIS INTERFACE SHOULD BE PLACEHOLDER AND BE DELETED AND USE IMPORT TYPE AFTER GOALS IS DONE
interface GoalItem {
  id: string;
  name: string;
  price: number;
  deposited: number;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userID: string;
}

function Home() {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const username = useUserAuth((s) => s.user?.name || "User");

  const { data, isLoading, error } = useLoadBudget();

  const totalBudget = data?.budget ?? 0;
  const { totalSpent, remaining, maxCategory } = useExpenseCalc(totalBudget);

  const usedBudgetPercent =
    totalSpent > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(2)) : 0;

  const today = new Date();
  useLoadExpense(today.getMonth() + 1, today.getFullYear(), false);
  const { items } = useExpense();

  const { icon } = getCategoryData(maxCategory.category);

  const [goals, setGoals] = useState<GoalItem[]>([]);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#ff8801] to-[#fed425] rounded-b-3xl h-96 w-full">
        <div className="p-5 flex flex-col gap-8">
          {/* Header & Greeting */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4 items-center">
              <div>
                <WinkMascot width={48} height={48} />
              </div>
              <div className="flex flex-col text-white">
                <p className="text-base font-medium">Good {greeting},</p>
                <p className="text-2xl font-bold">{username}</p>
              </div>
            </div>
            <div className="border-3 border-white rounded-2xl">
              <div>
                <Button
                  variant="blue"
                  size="sm"
                  className="!p-1 rounded-2xl"
                  onClick={() => navigate("/settings")}
                >
                  <SettingsIcon width={28} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-white gap-4 px-2">
            <div className="flex flex-row justify-between">
              <p className="text-lg font-semibold">You've spent</p>
              <p className="text-lg font-semibold">this month</p>
            </div>

            {/* Total expense goes here! v*/}
            <div className="flex flex-row items-end">
              <p className="text-4xl font-bold text-white">Rp{totalSpent}</p>
              <p className="text-2xl font-bold text-white/70">,00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-42 m-6">
        <div className="flex flex-col gap-4">
          <div className="absolute z-40 right-4 -top-5">
            <HappyMascot width={64} height={64} />
          </div>
          <div className="bg-surface p-5 rounded-3xl border-border shadow-[0_6px_0_0_var(--color-border)]">
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-bold text-text-primary/80">
                My Budget
              </p>

              {/* Progress bar here! No logic here yet, just dummy */}
              <div className="flex flex-col gap-3 mb-1 border-b-2 pb-6 border-gray-200">
                <ProgressBar
                  value={remaining}
                  max={totalBudget}
                  height={22}
                ></ProgressBar>
                <div className="flex flex-row justify-between items-center px-2">
                  <p className="text-sm font-bold text-text-primary/50">
                    {remaining} / {totalBudget}
                  </p>
                  <p className="text-sm font-bold text-text-primary/50">
                    {usedBudgetPercent}% used
                  </p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col flex-1 gap-1 items-center pr-2">
                  <p className="text-base font-bold text-text-primary/50 ">
                    Avg. spent / day
                  </p>
                  <p className="text-[30px] py-1">💸</p>
                  <p className="text-lg font-bold text-text-primary">
                    Rp{(totalSpent / today.getDate()).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col flex-1 gap-1 items-center border-l-2 border-gray-200">
                  <p className="text-base font-bold text-text-primary/50">
                    Top category
                  </p>
                  {/* <FoodIcon width={30} height={30} className="my-2" /> */}
                  <div className="py-1">{icon}</div>
                  <p className="text-lg font-bold text-text-primary">
                    {maxCategory.category.charAt(0).toUpperCase() + maxCategory.category.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-10">
        <div className=" mt-4 flex flex-col gap-8">
          {/* CURRENT GOALS */}
          <div>
            <p className="text-2xl font-bold mb-2 text-text-primary px-4">
              Current Goals
            </p>
            {goals.length > 0 ? (
              <div className="flex flex-col gap-3">
                {goals.slice(0, 3).map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 bg-surface rounded-2xl border-none shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-text-primary">
                          {item.name}
                        </p>
                        <p className="text-sm text-inactive">
                          Rp {item.deposited.toLocaleString()} / Rp{" "}
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
                {goals.length > 3 && (
                  <button
                    onClick={() => navigate("/goals")}
                    className="text-primary font-bold text-sm mt-2 text-center"
                  >
                    View all {goals.length} goals
                  </button>
                )}
              </div>
            ) : (
              <Card>
                <div className="p-5 items-center justify-center flex flex-col gap-4 bg-surface rounded-2xl">
                  <HeadbandMascot width={72} height={72} />
                  <p className="text-inactive font-semibold text-base text-center">
                    You haven't made a goal yet
                  </p>
                  <Button
                    size="lg"
                    variant="primary"
                    className="!py-2"
                    onClick={() => navigate("/goals")}
                  >
                    Make a goal
                  </Button>
                </div>
              </Card>
            )}
          </div>
          {/* RECENT EXPENSES */}
          <div>
            <p className="text-2xl font-bold mb-2 text-text-primary px-4">
              Recent Expenses
            </p>

            {items.length > 0 ? (
              <div>
                {items.slice(0, 3).map((item) => (
                  <Card
                    key={item.id}
                    size="md"
                    onClick={() => navigate(`/expense/${item.id}/view`)}
                    className="active:bg-slate-100 !my-3"
                  >
                    <ExpenseList
                      vendorName={item.vendorName}
                      date={new Date(item.dateTime)}
                      currency={item.currency}
                      amount={(item.totalAmount ?? 0).toString()}
                      category={item.category}
                    />
                  </Card>
                ))}

                {items.length > 3 && (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => navigate("/expenses")}
                      className="text-sm font-bold text-primary mt-1 text-center"
                    >
                      See all expenses
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <div className="p-5 items-center justify-center flex flex-col gap-4 bg-surface rounded-2xl">
                  <WhistleMascot width={72} height={72} />
                  <p className="text-inactive font-semibold text-base text-center">
                    You haven't added a new expense yet
                  </p>
                  <Button
                    size="lg"
                    variant="primary"
                    className="!py-2"
                    onClick={() => navigate("/add-expense")}
                  >
                    Add expense
                  </Button>
                </div>
              </Card>
            )}
          </div>
          \{" "}
        </div>
      </div>
    </div>
  );
}

export default Home;
