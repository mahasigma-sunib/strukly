import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import WalletPopup from "../components/popup/PopUp";
import TransactionCard from "../components/TransactionCard";
import WalletList from "../components/WalletList";
import useUserAuth from "../store/UserAuthStore";
import "../css/WalletPopUp.css";


function Home() {
  const { items: Wallets } = useWallet();
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet } = useWallet();

  const [showWalletInputs, setShowWalletInputs] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const username = useUserAuth((s) => s.userName)

  const handleAddWallet = () => {
    if (newWalletName.trim() === "" || newWalletBalance.trim() === "") {
      setWalletError("Please fill in all fields");
      return;
    }
    if (isNaN(Number(newWalletBalance)) || Number(newWalletBalance) < 0) {
      setWalletError("Balance must be a non-negative number");
      return;
    }
    if (Wallets.some((wallet) => wallet.name === newWalletName)) {
      setWalletError("Wallet name must be unique");
      return;
    }

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
          walletError={walletError || undefined}
          onNameChange={setNewWalletName}
          onBalanceChange={setNewWalletBalance}
          onAddWallet={handleAddWallet}
          onClose={() => setShowWalletInputs(false)}
        />
        <button
          onClick={() => {
            setWalletError(null);
            setShowWalletInputs(true);
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
