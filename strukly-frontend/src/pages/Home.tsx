import { useState } from "react";
import type { WalletType } from "../type/WalletType";
import useWallet from "../store/WalletStore";
import useTransactionCategory from "../store/TransactionCategoryStore";
import useTransaction from "../store/TransactionStore";
import type { TransactionType } from "../type/TransactionType";
import type { TransactionCategoryType } from "../type/TransactionCategoryType";

function Home() {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const { addWallet, items: Wallets } = useWallet();
  function calcTotalBalance(items: WalletType[]) {
    return items.reduce((sum, wallet) => sum + wallet.balance, 0);
  }
  const totalBalance = calcTotalBalance(Wallets);

  const { items: TransactionCategories } = useTransactionCategory();

  const { items: Transactions } = useTransaction();
  const sortedTransaction = [...Transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  function calcTotalExpense(
    transactions: TransactionType[],
    categories: TransactionCategoryType[]
  ) {
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id, cat.type);
    });

    return transactions
      .filter(tx => categoryMap.get(tx.categoryId) === "expense")
      .reduce((sum,tx) => sum + tx.total, 0);
  }
  const totalExpense = calcTotalExpense(Transactions, TransactionCategories);

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
        <br />
        {/* <input type="text" placeholder="CategoryName" /> */}
        <>Total Balance: {totalBalance.toFixed(2)}</> <br />
        <>Total Expense: {totalExpense.toFixed(2)}</>

        <ul>
          {TransactionCategories.map((item) => (
            <li key={item.id}>
              {item.type} - {item.categoryName} - {item.amount}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Recent Transaction</h2>
        <input type="text" />
        <ul>
          {sortedTransaction.map((transaction) => (
            <li key={transaction.id}>
              <strong>Date: {transaction.date.toLocaleString()} - {transaction.categoryId}</strong>
              <br />
              Items:
              <ul>
                {transaction.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    Item Name: {item.itemName}, Quantity: {item.quantity},
                    Single Item Price: {item.singleItemPrice}, Total Price:{" "}
                    {item.totalPrice}
                  </li>
                ))}
              </ul>
              Tax: {transaction.tax}, Service Charge:{" "}
              {transaction.serviceCharge}, Total: {transaction.total}
              <p></p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;
