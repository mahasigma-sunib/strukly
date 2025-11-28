import Card from "../components/card/card";
import ExpenseList from "../components/card/ExpenseListCard";
import useExpense, { useLoadExpense } from "../store/ExpenseStore";

export default function ExpenseTracker() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  useLoadExpense(month, year);
  const { items, isLoading, error } = useExpense();

  return (
    <div>
      <div>
        {month}
        {","}
        {year}
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div>
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
  );
}
