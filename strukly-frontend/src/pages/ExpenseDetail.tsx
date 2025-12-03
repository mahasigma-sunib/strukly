import { useParams, Link } from "react-router-dom";
import useExpense from "../store/ExpenseStore";

function ExpenseDetail() {
  const { id } = useParams();
  const { items: expenses } = useExpense();
  const expense = expenses.find((tx) => tx.id === id);

  if (!expense) {
    return (
      <div>
        <h2>Expense Not Found</h2>
        <p>No expense with the ID "{id}" exists.</p>
        <Link to="/history">Go back to history</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h1>Expense Details</h1>
      {/* <p>
        <strong>ID:</strong> {expense.id}
      </p> */}
      <p>
        <strong>Category:</strong> {expense.category}
      </p>
      <p>
        <strong>{expense.vendorName}</strong>
      </p>
      <p>
        <strong>Date:</strong> {expense.dateTime.toLocaleString()}
      </p>
      <p>
        <strong>Total:</strong> ${expense.totalAmount.toFixed(2)}
      </p>

      <h3>Items:</h3>
      <div>
        {expense.items.map((item, index) => (
          <div key={index}>
            {item.quantity} x {item.name} ($
            {item.singleItemPrice.toFixed(2)})
          </div>
        ))}
      </div>

      <Link to="/history">Go back to history</Link>
    </div>
  );
}

export default ExpenseDetail;
