import TransactionCard from "../components/TransactionCard";

function TransactionHistory() {
  return (
    <div>
      <h1>Transaction History</h1>
      <p>Click on a transaction to see its details.</p>
      <TransactionCard />
    </div>
  );
}

export default TransactionHistory;
