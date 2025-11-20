/*
  Warnings:

  - You are about to drop the column `transaction_method` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `TransactionHeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TransactionHeader" DROP CONSTRAINT "TransactionHeader_userID_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionItem" DROP CONSTRAINT "TransactionItem_transactionID_fkey";

-- AlterTable
ALTER TABLE "public"."Wallet" DROP COLUMN "transaction_method",
ADD COLUMN     "expense_method" TEXT NOT NULL DEFAULT 'cash';

-- DropTable
DROP TABLE "public"."TransactionHeader";

-- DropTable
DROP TABLE "public"."TransactionItem";

-- CreateTable
CREATE TABLE "public"."ExpenseHeader" (
    "id" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "vendorName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subtotalAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "serviceAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "ExpenseHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExpenseItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "singlePrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expenseID" TEXT NOT NULL,

    CONSTRAINT "ExpenseItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ExpenseHeader" ADD CONSTRAINT "ExpenseHeader_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseItem" ADD CONSTRAINT "ExpenseItem_expenseID_fkey" FOREIGN KEY ("expenseID") REFERENCES "public"."ExpenseHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
