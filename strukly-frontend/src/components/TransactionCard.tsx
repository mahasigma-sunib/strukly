import { Link } from "react-router-dom";
import type { TransactionType } from "../type/TransactionType";
import useTransaction from "../store/TransactionStore";
// import type { TransactionCategoryType } from "../type/TransactionCategoryType";
// import useTransactionCategory from "../store/TransactionCategoryStore";

function TransactionCard() {
  const { items: transactions } = useTransaction();
  // const { items: categories } = useTransactionCategory();

  // const categoryMap = new Map();
  // categories.forEach((cat: TransactionCategoryType) =>
  //   categoryMap.set(cat.id, cat.type)
  // );

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div>
      <div>
        {sortedTransactions.map((transaction: TransactionType) => {
          // const transactionType = categoryMap.get(transaction.categoryId);
          const transactionCategory = transaction.category;
          const sign = transactionCategory === "income" ? "+" : "-";
          const color = transactionCategory === "income" ? "green" : "red";

          return (
            <div key={transaction.id}>
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
                  <strong>{transaction.name}</strong><br />
                  <strong>Date:</strong> {transaction.date.toLocaleString()}
                </div>
                <div>
                  {/* Display the sign and total with color */}
                  <span style={{ color: color, fontWeight: "bold" }}>
                    {sign}${transaction.total.toFixed(2)}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionCard;
