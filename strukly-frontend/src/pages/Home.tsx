import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import useTransactionCategory from "../store/TransactionCategoryStore";

function Beranda() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();

  const {
    items: ExpenseCategories,
  } = useTransactionCategory();

  return (
    <>
      <h1>Beranda</h1>

      <div>
        <h2>Wallet</h2>
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
          }}
        >
          Add New Wallet
        </button>
        <ul>
          {Wallets.map((item) => (
            <li key={item.id}>
              {item.name}: {item.balance}
              {/* <button>Update</button>
              <button>Delete</button> */}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Dashboard</h2>
        {/* <input type="text" placeholder="CategoryName" /> */}
        <ul>
          {ExpenseCategories.map((item) => (
            <li key={item.id}>
              {item.categoryName} - {item.balance}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Beranda;
