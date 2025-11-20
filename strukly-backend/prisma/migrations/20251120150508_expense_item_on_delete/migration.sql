-- DropForeignKey
ALTER TABLE "public"."ExpenseItem" DROP CONSTRAINT "ExpenseItem_expenseID_fkey";

-- AddForeignKey
ALTER TABLE "public"."ExpenseItem" ADD CONSTRAINT "ExpenseItem_expenseID_fkey" FOREIGN KEY ("expenseID") REFERENCES "public"."ExpenseHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
