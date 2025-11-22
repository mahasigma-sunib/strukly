import Card from "../components/card/card";
import ExpenseList from "../components/card/ExpenseListCard";

export default function ExpenseTracker() {
  return (
    <div>
      <br />

      <Card size="md">
        <ExpenseList
          icon={<span>🍕</span>}
          vendorName="Pizza Hut"
          date={new Date()}
          currency="-Rp"
          amount="85.000"
          category="food"
        />
      </Card>
    </div>
  );
}
