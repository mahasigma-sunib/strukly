import useUserAuth from "../store/UserAuthStore";
import TextLogo from "../components/logos/TextLogo";
import SettingsIcon from "../components/utilityIcons/SettingsIcon";
import Button from "../components/button/Button";
import HappyMascot from "../components/mascots/HappyMascot";
import HeadbandMascot from "../components/mascots/HeadbandMascot";
import Card from "../components/card/Card";
import WhistleMascot from "../components/mascots/WhistleMascot";
import WinkMascot from "../components/mascots/WinkMascot";
import FoodIcon from "../components/categoryIcons/FoodIcon";
import ProgressBar from "../components/graph/ProgressBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ExpenseType } from "../type/ExpenseType";

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

// Made by Edo
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
  const username = useUserAuth((s) => s.user?.name || "User");

  const greeting = getGreeting();

  // For Date Time (if not used, can delete)
  // const today = new Date();
  // const currentMonthIndex = today.getMonth();
  // const currentYear = today.getFullYear();
  // const monthNames = [
  //   "Jan",
  //   "Feb",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "June",
  //   "July",
  //   "Aug",
  //   "Sep",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];
  // const currentMonthName = monthNames[currentMonthIndex];
  // const currentMonthYear = `${currentMonthName} ${currentYear}`;

  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  // Made by Edo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [resGoals, resExpenses] = await Promise.all([
          fetch("http://localhost:3000/goals", { headers }),
          fetch("http://localhost:3000/expenses", { headers }),
        ]);

        if (resGoals.ok) {
          const data = await resGoals.json();
          setGoals(data.goalItems || []);
        }

        if (resExpenses.ok) {
          const data = await resExpenses.json();
          setExpenses(data.expenseItems || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center text-inactive">Loading goals...</div>
    );
  }

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
                <Button variant="blue" size="sm" className="!p-1 rounded-2xl">
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
              <p className="text-4xl font-bold text-white">Rp120.000</p>
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

              {/* Progress bar here! No logic yet, just a dummy */}
              <div className="flex flex-col gap-3 mb-1 border-b-2 pb-6 border-gray-200">
                <ProgressBar
                  value={200000}
                  max={320000}
                  height={22}
                ></ProgressBar>
                <div className="flex flex-row justify-between items-center px-2">
                  <p className="text-sm font-bold text-text-primary/50">
                    200.000 / 320.000
                  </p>
                  <p className="text-sm font-bold text-text-primary/50">
                    37% used
                  </p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col flex-1 gap-1 items-center pr-2">
                  <p className="text-base font-bold text-text-primary/50 ">
                    Avg. spent / day
                  </p>
                  <p className="text-[30px]">💸</p>
                  <p className="text-lg font-bold text-text-primary">
                    Rp15.000
                  </p>
                </div>

                <div className="flex flex-col flex-1 gap-1 items-center border-l-2 border-gray-200">
                  <p className="text-base font-bold text-text-primary/50">
                    Top category
                  </p>
                  <FoodIcon width={30} height={30} className="my-2" />
                  <p className="text-lg font-bold text-text-primary">Food</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content: Goals & Expenses */}
      <div className="pb-24">
        <div className="p-5 mt-4 flex flex-col gap-8">
          {/* CURRENT GOALS */}
          <div>
            <p className="text-2xl font-bold mb-2 text-text-primary">
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
              <Card className="!m-0">
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
            <p className="text-2xl font-bold mb-2 text-text-primary">
              Recent Expenses
            </p>

            {expenses.length > 0 ? (
              <div className="flex flex-col gap-3">
                {expenses.slice(0, 3).map((exp) => (
                  <Card
                    key={exp.id}
                    className="p-4 bg-surface rounded-2xl flex justify-between items-center shadow-sm border-none"
                  >
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary text-lg leading-tight">
                        {exp.vendorName}
                      </p>
                      <p className="text-xs text-inactive uppercase tracking-wider font-semibold">
                        {exp.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-red-500 text-lg">
                        - Rp{exp.totalAmount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[10px] text-inactive">
                        {new Date(exp.dateTime).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </Card>
                ))}

                {expenses.length > 3 && (
                  <button
                    onClick={() => navigate("/expenses")}
                    className="text-sm font-bold text-primary mt-1 text-center"
                  >
                    See all expenses
                  </button>
                )}
              </div>
            ) : (
              <Card className="!m-0">
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

          {/* End Of The Page */}
        </div>
      </div>
    </div>
  );
}

export default Home;
