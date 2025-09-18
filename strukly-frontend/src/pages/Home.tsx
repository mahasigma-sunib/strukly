import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import TransactionCard from "../components/TransactionCard";
import "../css/WalletSection.css";

function Home() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();

  // const { items: TransactionCategories } = useTransactionCategory();
  // const { items: Transactions } = useTransaction();

  const [showWalletInputs, setShowWalletInputs] = useState(false);

  return (
    <>
      <h1>Strukly</h1>
      <h2>Halo, NAMA</h2>

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
          onClick={() => {
            const wallet: WalletType = {
              setShowWalletInputs(true)
              // userId: ;
              id: crypto.randomUUID(),
              name: newWalletName,
              balance: parseInt(newWalletBalance),
            };
            addWallet(wallet);
          }}
        >
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

      <div style={{ margin: '1rem 0' }}>
        <h2>Dashboard</h2>
        <div>Total Balance: {totalBalance.toFixed(2)}</div>
        <div>Total Expense: {totalExpense.toFixed(2)}</div>
        <ul>
          {TransactionCategories.map((item) => (
            <li key={item.id}>
              {item.type} - {item.categoryName} - {item.amount}
            </li>
          ))}
        </ul>
        <br /> 
        {/* to be fixed later when proper styling for transaction details is added */}
      </div>

      <div style={{ margin: '1rem 0' }}>
        <h2>Recent Transaction</h2>
        <TransactionCard />
      </div>
    </>
  );
}

export default Home;
