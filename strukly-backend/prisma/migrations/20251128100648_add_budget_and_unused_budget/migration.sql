-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "budget" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "unusedBudget" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."BudgetHistory" (
    "userID" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "budget" DECIMAL(65,30) NOT NULL,
    "unusedBudget" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetHistory_pkey" PRIMARY KEY ("userID","month","year")
);

-- AddForeignKey
ALTER TABLE "public"."BudgetHistory" ADD CONSTRAINT "BudgetHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
