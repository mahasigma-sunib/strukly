import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card/Card";
import ExpenseList from "../components/card/ExpenseListCard";
import useExpense, { useLoadExpense } from "../store/ExpenseStore";
import Button from "../components/button/Button";
import CustomBarChart from "../components/chart/barchart";
import Drawer from "../components/drawer/Drawer";
import Datepicker from "../components/scroll/DatePicker";

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
      <div className="m-4 my-7 flex items-center justify-between">
        <div className="font-bold text-3xl">
          <p>Tracker</p>
        </div>
        <div>
          <Button
            onClick={() => setIsDrawerOpen(true)}
            variant="primary"
            size="md"
            className="
              !rounded-2xl 
              border-1
              !font-bold 
              border-b-[4px] 
              shadow-[0_5px_0_rgb(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)]
              active:translate-y-[4px]
              !transition-all
              active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.2)]
            "
          >
            {monthName} {activeDate.year}
          </Button>
        </div>

        {/* drawer */}
        <Drawer
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Select Period"
        >
          <div className="flex flex-col h-full">
            <div className="mb-6 mt-2">
              <p className="text-[var(--fun-color-text-secondary)] text-center mb-4 text-sm">
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
                size="lg"
                className="w-full !rounded-xl shadow-lg"
                onClick={handleApplyFilter}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </Drawer>
      </div>

      <div className="my-5">
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

      {/* expense history */}
      <div>
        <div className="ml-5 mb-0 font-bold text-xl">
          <p>Expense History</p>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="mt-0">
          {/* conditional example */}
          {items.length === 0 && (
            <Card size="md">
              <ExpenseList
                vendorName="Example"
                date={new Date()}
                currency="-Rp"
                amount="123.000"
                category="others"
              />
            </Card>
          )}

          {items.map((item) => (
            <Card
              key={item.id}
              size="md"
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
  );
}
