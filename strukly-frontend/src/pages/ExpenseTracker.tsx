import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card/Card";
import ExpenseList from "../components/card/ExpenseListCard";
import useExpense, { useLoadExpense } from "../store/ExpenseStore";
import Button from "../components/button/Button";
import CustomBarChart from "../components/chart/barchart";
import Drawer from "../components/drawer/Drawer";
import Datepicker from "../components/scroll/DatePicker";
import CalendarIcon from "../components/utilityIcons/CalendarIcon";
import ExpenseEmptyMascot from "../components/mascots/ExpenseEmptyMascot";

export default function ExpenseTracker() {
  const today = new Date();

  const [activeDate, setActiveDate] = useState({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[activeDate.month - 1];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [tempDate, setTempDate] = useState(activeDate);

  useLoadExpense(activeDate.month, activeDate.year, true); //month, year, getstat

  // reset temp date when drawer opens to match current active date
  useEffect(() => {
    if (isDrawerOpen) {
      setTempDate(activeDate);
    }
  }, [isDrawerOpen, activeDate]);

  const handleApplyFilter = () => {
    setActiveDate(tempDate);
    setIsDrawerOpen(false);
  };

  const navigate = useNavigate();
  const { statistic, items, isLoading, error } = useExpense();
  // console.log(statistic.weekly);

  return (
    <div>
      {/* page Title & date btn */}
      <div className="px-5 py-4 flex bg-surface border-b-2 w-full border-border fixed rounded-b-3xl">
        <div className="flex flex-row justify-between w-full items-center">
          <div>
            <p className="font-bold text-3xl">Expense</p>
          </div>
          <div className="pb-2">
            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="primary"
              size="md"
              className="
              !rounded-full 
              !font-bold 
              active:translate-y-[4px]
              !transition-all
              flex flex-row gap-1
              text-lg
              justify-center
              items-center
              !py-2
              !px-3
            "
            >
              {<CalendarIcon className="text-white" />}
              {monthName} {activeDate.year}
            </Button>
          </div>
        </div>

        {/* drawer */}
        <Drawer
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Select Period"
        >
          <div className="flex flex-col h-full">
            <div className="mb-5">
              <p className="text-text-secondary text-center mb-4 text-md">
                Scroll to select month and year
              </p>

              {/* wheel picker */}
              <Datepicker
                selectedMonth={tempDate.month}
                selectedYear={tempDate.year}
                onChange={(month, year) => setTempDate({ month, year })}
              />
            </div>

            {/* action btn */}
            <div className="mt-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full !rounded-2xl pt-4 pb-4 text-lg"
                onClick={handleApplyFilter}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </Drawer>
      </div>

      <div className="p-5">
        {/* Bar Chart */}
        <div>
          {items.length > 0 && (
            <div className="mx-4 my-5 bg-surface rounded-3xl py-6 border-border border-1">
              <p className="ml-6 mb-2 text-2xl text-text-primary font-bold">
                Tracker
              </p>
              <CustomBarChart
                data={statistic.weekly}
                xAxisKey="name"
                height={300}
                bars={[
                  {
                    key: "spending",
                    color: "var(--fun-color-primary)",
                    label: "Weekly Expense",
                  },
                ]}
              />
            </div>
          )}
        </div>

        {/* expense history */}
        <div className="w-full min-h-dvh mt-22">
          <div className="font-bold text-2xl">
            <p>History</p>
          </div>

          {isLoading && <p>Loading...</p>}

          {error && <p>{error}</p>}

          <div className="mt-0">
            {items.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center mt-28 gap-4 ">
                <ExpenseEmptyMascot width={148} height={148} />
                <p className="text-inactive font-bold text-lg text-center">
                  You have no transactions yet.
                </p>
              </div>
            )}

            {items.map((item) => (
              <Card
                key={item.id}
                size="md"
                className="bg-[#EFF4FA] shadow-[0_4px_0_0_#D9E8F5]"
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
