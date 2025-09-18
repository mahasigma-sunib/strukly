import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import TransactionCard from "../components/TransactionCard";
import useUserAuth from "../store/UserAuthStore";
import "../css/WalletSection.css";

function Home() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();

  const [showWalletInputs, setShowWalletInputs] = useState(false);
  const username = useUserAuth((s) => s.userName)

  return (
    <>
      <h1>Strukly</h1>
      <h2>Halo, {username}</h2>

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
            setShowWalletInputs(true);
            const wallet: WalletType = {
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
              <div className="wallet-list-card" key={item.id}>
                <div className="item-name">{item.name}</div>
                <div className="item-balance">{item.balance}</div>
              </div>
            ))}
            <div
              className="wallet-list-card add-wallet-card"
              onClick={() => setShowWalletInputs(true)}
            >
              <span style={{ fontSize: "2em" }}>+</span>
              <span>Add Wallet</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <h2>Dashboard</h2>
        <div>Total Balance: {}</div>
        <div>Total Expense: {}</div>
        {/* to be fixed later when proper styling for transaction details is added */}
      </div>

      <div style={{ margin: "1rem 0" }}>
        <h2>Recent Transaction</h2>
        <TransactionCard />
      </div>
    </>
  );
}

export default Home;
