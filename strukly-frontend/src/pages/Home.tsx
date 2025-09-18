import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import TransactionCard from "../components/TransactionCard";
// import useTransaction from "../store/TransactionStore";
// import type { TransactionType } from "../type/TransactionType";
// import type { TransactionCategoryType } from "../type/TransactionCategoryType";
// import useTransactionCategory from "../store/TransactionCategoryStore";
// import useUserAuth from "../store/UserAuthStore";

function Home() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();

  // const { items: TransactionCategories } = useTransactionCategory();
  // const { items: Transactions } = useTransaction();

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
        <ul>
          {Wallets.map((item) => (
            <li key={item.id}>
              {item.name}: {item.balance}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Dashboard</h2>

      </div>

      <div>
        <h2>Recent Transaction</h2>
        <TransactionCard />
      </div>
    </>
  );
}

export default Home;
