import React from "react";
import "../../css/WalletPopUp.css";

type WalletPopupProps = {
  visible: boolean;
  walletName: string;
  walletBalance: string;
  onNameChange: (value: string) => void;
  onBalanceChange: (value: string) => void;
  onAddWallet: () => void;
  onClose: () => void;
};

const WalletPopup: React.FC<WalletPopupProps> = ({
  visible,
  walletName,
  walletBalance,
  onNameChange,
  onBalanceChange,
  onAddWallet,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className="wallet-popup">
      <div className="wallet-inputs">
        <button
          className="close-popup-button"
          onClick={onClose}
          aria-label="Close"
        >
          x
        </button>
        <input
          type="text"
          placeholder="Wallet Name"
          value={walletName}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={walletBalance}
          onChange={(e) => onBalanceChange(e.target.value)}
        />
        <button onClick={onAddWallet}>Add New Wallet</button>
      </div>
    </div>
  );
};

export default WalletPopup;