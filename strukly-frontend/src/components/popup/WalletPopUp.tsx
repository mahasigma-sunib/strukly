import React from "react";
import { useTranslation } from "react-i18next";
import Popup from "./PopUp";

type WalletPopupProps = {
  visible: boolean;
  walletName: string;
  walletBalance: string;
  walletError?: string;
  onNameChange: (value: string) => void;
  onBalanceChange: (value: string) => void;
  onAddWallet: () => void;
  onClose: () => void;
};

const WalletPopup: React.FC<WalletPopupProps> = ({
  visible,
  walletName,
  walletBalance,
  walletError,
  onNameChange,
  onBalanceChange,
  onAddWallet,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <Popup visible={visible} onClose={onClose}>
      <input
        type="text"
        placeholder={t("wallet.name")}
        className="w-4/5 p-2 border border-black rounded text-base focus:outline-none focus:border-black focus:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        value={walletName}
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
      />
      <input
        type="number"
        placeholder={t("wallet.initialBalance")}
        className="w-4/5 p-2 border border-black rounded text-base focus:outline-none focus:border-black focus:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        value={walletBalance}
        onChange={(e) => {
          onBalanceChange(e.target.value);
        }}
      />
      {walletError && <p className="text-red-500">{walletError}</p>}
      <button
        onClick={onAddWallet}
        className="mt-4 px-5 py-2 rounded cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
      >
        {t("wallet.add")}
      </button>
    </Popup>
  );
};

export default WalletPopup;
