import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import WalletPopup from "../components/popup/PopUp";
import TransactionCard from "../components/TransactionCard";
import WalletList from "../components/WalletList";
import useUserAuth from "../store/UserAuthStore";
import "../css/WalletPopUp.css";


function Home() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();

  const [showWalletInputs, setShowWalletInputs] = useState(false);
  const username = useUserAuth((s) => s.userName)

  const handleAddWallet = () => {
    const wallet: WalletType = {
      id: crypto.randomUUID(),
      name: newWalletName,
      balance: parseInt(newWalletBalance),
    };
    addWallet(wallet);
    setShowWalletInputs(false);
    setNewWalletName("");
    setNewWalletBalance("");
  };

  return (
    <>
      <h1>Strukly</h1>
      <h2>Halo, {username}</h2>

      <div>
        <WalletPopup
          visible={showWalletInputs}
          walletName={newWalletName}
          walletBalance={newWalletBalance}
          onNameChange={setNewWalletName}
          onBalanceChange={setNewWalletBalance}
          onAddWallet={handleAddWallet}
          onClose={() => setShowWalletInputs(false)}
        />
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
        <WalletList />
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
