import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import type { TransactionType } from "../type/TransactionType";
import type { TransactionCategoryType } from "../type/TransactionCategoryType";
import useWallet from "../store/WalletStore";
import useTransactionCategory from "../store/TransactionCategoryStore";
import useTransaction from "../store/TransactionStore";
import TransactionCard from "../components/TransactionCard";
import "../css/WalletSection.css";

function Home() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();

  const { items: TransactionCategories } = useTransactionCategory();
  const { items: Transactions } = useTransaction();

  function calcTotalBalance(items: WalletType[]) {
    return items.reduce((sum, wallet) => sum + wallet.balance, 0);
  }
  const totalBalance = calcTotalBalance(Wallets);

  function calcTotalExpense(
    transactions: TransactionType[],
    categories: TransactionCategoryType[]
  ) {
    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.type);
    });

    return transactions
      .filter((tx) => categoryMap.get(tx.categoryId) === "expense")
      .reduce((sum, tx) => sum + tx.total, 0);
  }
  const totalExpense = calcTotalExpense(Transactions, TransactionCategories);

  const [showWalletInputs, setShowWalletInputs] = useState(false);

  return (
    <>
      <h1>Beranda</h1>

      <div>
        {showWalletInputs && (
          <div className="wallet-popup">
            <div className="wallet-inputs">
              <button
                className="close-popup-button"
                onClick={() => setShowWalletInputs(false)}
                aria-label="Close"
              >
                x
              </button>
              <input
                type="text"
                placeholder="Wallet Name"
                value={newWalletName}
                onChange={(event) => setNewWalletName(event?.target.value)}
              />
              <input
                type="number"
                placeholder="Initial Balance"
                value={newWalletBalance}
                onChange={(event) => setNewWalletBalance(event?.target.value)}
              />
              <button
                onClick={() => {
                  const wallet: WalletType = {
                    id: crypto.randomUUID(),
                    name: newWalletName,
                    balance: parseInt(newWalletBalance),
                  };
                  addWallet(wallet);
                  setShowWalletInputs(false); // Close popup after adding
                }}
              >
                Add New Wallet
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowWalletInputs(true)}>
          Add New Wallet
        </button>
        <div style={{ width: "100%", maxWidth: "100vw", overflowX: "auto" }}>
          <div className="wallet-list">
            {Wallets.map((item) => (
              <li key={item.id}>
                <div className="item-name">{item.name}</div>
                <div className="item-balance">{item.balance}</div>
              </li>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2>Dashboard</h2>
        <br />
        <>Total Balance: {totalBalance.toFixed(2)}</> <br />
        <>Total Expense: {totalExpense.toFixed(2)}</>
        <ul>
          {TransactionCategories.map((item) => (
            <li key={item.id}>
              {item.type} - {item.categoryName} - {item.amount}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Recent Transaction</h2>
        <TransactionCard />
      </div>
    </>
  );
}

export default Home;
