/*
  Warnings:

  - Added the required column `members` to the `ExpenseHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `myAmount` to the `ExpenseHeader` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ExpenseHeader" ADD COLUMN     "members" JSONB NOT NULL,
ADD COLUMN     "myAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."ExpenseItem" ADD COLUMN     "assignedMember" TEXT;
