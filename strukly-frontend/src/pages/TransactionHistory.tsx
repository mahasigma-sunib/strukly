import TransactionCard from "../components/TransactionCard";
import useUserAuth from "../store/UserAuthStore";


function TransactionHistory() {
  const logout = useUserAuth((s) => s.logout)
  return (
    <div>
      <h1>Transaction History</h1>
      <button onClick={logout}>Log out</button>
      <p>Click on a transaction to see its details.</p>
      <TransactionCard />
    </div>
  );
}

export default TransactionHistory;
