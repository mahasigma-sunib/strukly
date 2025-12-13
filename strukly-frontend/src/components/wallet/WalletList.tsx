import React, { useState } from "react";
import type { WalletType } from "../../type/WalletType";
import useWallet from "../../store/WalletStore";
import WalletPopup from "../popup/WalletPopUp";
import WalletCard from "./WalletCard";

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
        <div className="flex gap-4 overflow-x-auto p-2 list-none my-2 box-border scroll-smooth text-left [&::-webkit-scrollbar]:hidden">
          {Wallets.map((item) => (
            <WalletCard item={item} key={item.id} />
          ))}
          <div
            className="min-w-[125px] h-[70px] shadow-[0_0_5px_rgba(0,0,0,0.3)] rounded-lg p-10 flex-none cursor-pointer flex flex-col items-center justify-center text-[#646cff] font-bold text-[0.8em] bg-[#242424] hover:bg-[#2a2a3d] select-none"
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