import React, { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import WalletPopup from "./popup/WalletPopUp";
import WalletCard from "./WalletCard";
import "../css/WalletList.css";

const WalletList: React.FC = () => {
  const { items: Wallets, addWallet } = useWallet();
  const [showWalletInputs, setShowWalletInputs] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const [walletError, setWalletError] = useState<string | null>(null);

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
      <div style={{ width: "100%", maxWidth: "100vw", overflowX: "auto" }}>
        <div className="wallet-list">
          {Wallets.map((item) => (
            <WalletCard item={item} key={item.id} />
          ))}
          <div
            className="wallet-list-card add-wallet-card"
            onClick={() => {
              setWalletError(null);
              setShowWalletInputs(true);
            }}
          >
            <span style={{ fontSize: "2em" }}>+</span>
            <span>Add Wallet</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletList;