import { useParams, Link } from "react-router-dom";
import useTransaction from "../store/TransactionStore";

function TransactionDetail() {
  const { id } = useParams();
  const { items: transactions } = useTransaction();
  const transaction = transactions.find((tx) => tx.id === id);

  if (!transaction) {
    return (
      <div>
        <h2>Transaction Not Found</h2>
        <p>No transaction with the ID "{id}" exists.</p>
        <Link to="/history">Go back to history</Link>
      </div>
    );
  }

  return (
    <div style={{paddingLeft: '1rem', paddingRight: '1rem', width: '100%', margin: '0 auto', boxSizing: 'border-box'}}>
      <h1>Transaction Details</h1>
      <p>
        <strong>ID:</strong> {transaction.id}
      </p>
      <p>
        <strong>{transaction.name}</strong> 
      </p>
      <p>
        <strong>Date:</strong> {transaction.date.toLocaleString()}
      </p>
      <p>
        <strong>Category ID:</strong> {transaction.categoryId}
      </p>
      <p>
        <strong>Total:</strong> ${transaction.total.toFixed(2)}
      </p>

      <h3>Items:</h3>
      <div>
        {transaction.items.map((item, index) => (
          <div key={index}>
            {item.quantity} x {item.itemName} ($
            {item.singleItemPrice.toFixed(2)})
          </div>
        ))}
      </div>

      <Link to="/history">Go back to history</Link>
    </div>
  );
}

export default TransactionDetail;
