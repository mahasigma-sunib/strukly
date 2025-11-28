import Card from "../components/card/card";
import ExpenseList from "../components/card/ExpenseListCard";
import useExpense, { useLoadExpense } from "../store/ExpenseStore";
import Button from "../components/Button";

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

  useLoadExpense(month, year);
  const { items, isLoading, error } = useExpense();

  return (
    <div>
      <div className="m-4 my-7 flex items-center justify-between">
        <div className="font-bold text-3xl">
          <p>Tracker</p>
        </div>
        <div>
          <Button variant="primary" size="sm" className="!text-base px-4 border-2">
            {monthName}
            {","}
            {year}
          </Button>
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div>
        <div className="ml-5 mb-0 font-bold text-xl">
          <p>Expense History</p>
        </div>
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
            <Card size="md">
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
