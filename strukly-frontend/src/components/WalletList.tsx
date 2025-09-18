import React, { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import WalletPopup from "./popup/PopUp";
import "../css/WalletList.css";

const WalletList: React.FC = () => {
  const { items: Wallets, addWallet } = useWallet();
  const [showWalletInputs, setShowWalletInputs] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");

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
      <WalletPopup
        visible={showWalletInputs}
        walletName={newWalletName}
        walletBalance={newWalletBalance}
        onNameChange={setNewWalletName}
        onBalanceChange={setNewWalletBalance}
        onAddWallet={handleAddWallet}
        onClose={() => setShowWalletInputs(false)}
      />
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
    </>
  );
};

export default WalletList;