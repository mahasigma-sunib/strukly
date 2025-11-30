import { useState } from "react";
import Card from "../components/card/card";
import ExpenseList from "../components/card/ExpenseListCard";
import useExpense, { useLoadExpense } from "../store/ExpenseStore";
import Button from "../components/Button";
import Popup from "../components/popup/PopUp";
import CustomBarChart from "../components/chart/barchart";

export default function ExpenseTracker() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

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
  const monthName = monthNames[month - 1];

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useLoadExpense(month, year, true); //month, year, getstat
  const { statistic, items, isLoading, error } = useExpense();
  console.log(statistic.weekly);
  return (
    <div>
      {/* Page Title & Date button */}
      <div className="m-4 my-7 flex items-center justify-between">
        <div className="font-bold text-3xl">
          <p>Tracker</p>
        </div>
        <div>
          <Button
            onClick={() => setIsPopupOpen(true)}
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
            {monthName} {year}
          </Button>
        </div>

        {/* popup */}
        <Popup visible={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
          <p>ASD</p>
        </Popup>
      </div>

      <div className="my-5">
        <CustomBarChart
          data={statistic.weekly}
          xAxisKey="name"
          height={300}
          bars={[
            { key: "spending", color: "var(--fun-color-primary)", label: "Weekly Expense" },
          ]}
        />
      </div>

      {/* Expense History */}
      <div>
        <div className="ml-5 mb-0 font-bold text-xl">
          <p>Expense History</p>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="mt-0">
          <Card size="md">
            <ExpenseList
              vendorName="McDonald's"
              date={new Date()}
              currency="-Rp"
              amount="132.000"
              category="food"
            />
          </Card>

          {items.map((item) => (
            <Card key={item.id} size="md">
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
