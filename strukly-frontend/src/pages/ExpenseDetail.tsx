import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import type { ExpenseType } from "../type/ExpenseType";

function ExpenseDetail() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/api/expenses/${id}`,
    (url) => fetch(url, { credentials: "include" }).then((res) => res.json())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading expense</div>;
  if (!data?.expense) return <div>No expense found</div>;

  const raw = data.expense;
  const expense: ExpenseType = {
    userID: raw.userID,

    id: raw.id,
    dateTime: new Date(raw.dateTime),
    vendorName: raw.vendorName,
    category: raw.category,

    currency: "Rp ",
    subtotalAmount: raw.subtotalAmount.amount,
    taxAmount: raw.taxAmount.amount,
    discountAmount: raw.discountAmount.amount,
    serviceAmount: raw.serviceAmount.amount,
    totalAmount: raw.totalAmount.amount,

    items: raw.items.map((item: any) => ({
      expenseID: id,

      id: item.id,
      name: item.name,
      quantity: item.quantity,
      singleItemPrice: item.singlePrice.amount,
      totalPrice: item.totalPrice.amount,
    })),
  };
  // console.log(expense)

  if (!expense) {
    return (
      <div>
        <h2>Expense Not Found</h2>
        <p>No expense with the ID "{id}" exists.</p>
        <Link to="/expense">Go back to expense</Link>
      </div>
    );
  }

  return (
    <div></div>
  );
}

export default ExpenseDetail;
