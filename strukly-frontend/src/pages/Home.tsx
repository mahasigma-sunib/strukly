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

import OthersIcon from "../components/categoryIcons/OthersIcon";
import SettingsIcon from "../components/utilityIcons/SettingsIcon";
import WhistleMascot from "../components/mascots/WhistleMascot";
import { useLoadBudget } from "../hooks/useLoadBudget";
import { useExpenseCalc } from "../hooks/useExpenseCalc";
import { useLoadGoals } from "../hooks/useLoadGoals";
import useGoals from "../store/GoalsStore";
import GoalList from "../components/card/GoalListCard";

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

const getBarColor = (
  percent: number,
): "bg-sky-400" | "bg-yellow-400" | "bg-red-400" => {
  if (percent < 50) {
    return "bg-sky-400";
  } else if (percent >= 50 && percent <= 80) {
    return "bg-yellow-400";
  } else {
    return "bg-red-400";
  }
};

const formatIDR = (value: number) => {
  const formatted = (value || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const parts = formatted.split(",");

  return {
    main: parts[0],
    decimal: parts[1],
    full: formatted,
  };
};

function Home() {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const username = useUserAuth((s) => s.user?.name || "User");

  const { data } = useLoadBudget();

  const totalBudget = data?.budget ?? 0;
  const hasBudget = totalBudget > 0;
  const { totalSpent, remaining, maxCategory } = useExpenseCalc(totalBudget);

  const { icon } = getCategoryData(maxCategory.category);
  const usedBudgetPercent =
    remaining > 0 ? Number(((remaining / totalBudget) * 100).toFixed(2)) : 0;

  const today = new Date();
  const daysPassed = today.getDate();
  useLoadExpense(today.getMonth() + 1, today.getFullYear(), false);
  const { items } = useExpense();

  useLoadGoals();
  const { items: goals } = useGoals();
  const activeGoals = goals.filter((g) => !g.isCompleted);

  const barColor = getBarColor(usedBudgetPercent);

  const avgSpent = () => {
    const result = daysPassed === 0 ? 0 : totalSpent / daysPassed;
    return Math.round(result * 100) / 100;
  };

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
              <p className="text-4xl font-bold text-white">
                Rp{formatIDR(totalSpent).main}
              </p>
              <p className="text-2xl font-bold text-white/70">
                ,{formatIDR(totalSpent).decimal}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-42 my-6 mx-4">
        <div className="flex flex-col gap-4">
          <div className="absolute z-40 right-4 -top-5">
            <HappyMascot width={64} height={64} />
          </div>
          <div className="bg-surface p-5 rounded-3xl border-border shadow-[0_6px_0_0_var(--color-border)]">
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-bold text-text-primary/80">
                My Budget
              </p>

              {hasBudget ? (
                <div className="flex flex-col gap-3 mb-1 border-b-2 pb-6 border-gray-200">
                  <ProgressBar
                    value={remaining}
                    max={totalBudget}
                    height={22}
                    barColor={barColor}
                  ></ProgressBar>
                  <div className="flex flex-row justify-between items-center px-2">
                    <p className="text-sm font-bold text-text-primary/50">
                      Rp {formatIDR(remaining).full} /{" "}
                      {formatIDR(totalBudget).full}
                    </p>
                    <p className="text-sm font-bold text-text-primary/50">
                      {usedBudgetPercent}% left
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col gap-4 justify-center items-center">
                  <p className="text-center text-base text-inactive font-bold">
                    You haven't set a monthly budget
                  </p>
                  <Button
                    size="lg"
                    variant="primary"
                    className="!py-2"
                    onClick={() => navigate("/budget")}
                  >
                    Set Budget
                  </Button>
                </div>
              )}

              <div className="flex flex-row">
                <div className="flex flex-col flex-1 gap-1 items-center pr-2">
                  <p className="text-base font-bold text-text-primary/50 ">
                    Avg. spent / day
                  </p>
                  <p className="text-[30px] py-1">💸</p>
                  <div className="flex flex-row items-baseline">
                    <p className="text-lg font-bold text-text-primary">
                      Rp{formatIDR(avgSpent()).main}
                    </p>
                    <p className="text-xs font-bold text-text-primary/70">
                      ,{formatIDR(avgSpent()).decimal}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col flex-1 gap-1 items-center border-l-2 border-gray-200">
                  <p className="text-base font-bold text-text-primary/50">
                    Top category
                  </p>
                  {maxCategory.category ? (
                    <>
                      <div className="py-1 ml-2">{icon}</div>
                      <p className="text-lg ml-2 font-bold text-text-primary">
                        {maxCategory.category.charAt(0).toUpperCase() +
                          maxCategory.category.slice(1)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="py-1 ml-2">
                        <OthersIcon />
                      </div>
                      <p className="text-lg ml-2 font-bold text-text-primary">
                        -
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-22">
        <div className=" mt-4 flex flex-col gap-8">
          {/* CURRENT GOALS */}
          <div>
            <p className="text-2xl font-bold mb-2 text-text-primary px-4">
              Current Goals
            </p>

            {activeGoals.length > 0 ? (
              <div>
                {activeGoals.slice(0, 3).map((goal, idx) => (
                  <Card key={goal.id}>
                    <GoalList goal={goal} idx={idx} onHold={() => {}} />
                  </Card>
                ))}
                {goals.length > 3 && (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => navigate("/goals")}
                      className="text-sm font-bold text-primary mt-1 text-center"
                    >
                      View all {goals.length} goals
                    </button>
                  </div>
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
                      amount={formatIDR(item.totalAmount ?? 0).main}
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
                    onClick={() => navigate("/expense")}
                  >
                    Add expense
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
