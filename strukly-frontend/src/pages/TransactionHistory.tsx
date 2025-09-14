import { Link } from "react-router-dom";
import type { TransactionType } from "../type/TransactionType";
import type { TransactionCategoryType } from "../type/TransactionCategoryType";
import useTransaction from "../store/TransactionStore";
import useTransactionCategory from "../store/TransactionCategoryStore";

function TransactionHistory() {
  const { items: transactions } = useTransaction();
  const { items: categories } = useTransactionCategory();

  const categoryMap = new Map();
  categories.forEach((cat: TransactionCategoryType) =>
    categoryMap.set(cat.id, cat.type)
  );

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div>
      <h1>Transaction History</h1>
      <p>Click on a transaction to see its details.</p>

      <ul>
        {sortedTransactions.map((transaction: TransactionType) => {
          const transactionType = categoryMap.get(transaction.categoryId);
          const sign = transactionType === "income" ? "+" : "-";
          const color = transactionType === "income" ? "green" : "red";

          return (
            <li key={transaction.id}>
              <Link
                to={`/history/${transaction.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div>
                  <strong>Date:</strong> {transaction.date.toLocaleString()}
                </div>
                <div>
                  {/* Display the sign and total with color */}
                  <span style={{ color: color, fontWeight: "bold" }}>
                    {sign}${transaction.total.toFixed(2)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TransactionHistory;
