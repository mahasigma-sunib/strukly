/*
  Warnings:

  - You are about to drop the column `budget` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `unusedBudget` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "budget",
DROP COLUMN "unusedBudget";
