-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" TEXT NOT NULL,
    "userID" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "transaction_method" TEXT NOT NULL DEFAULT 'cash',
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "balanceCurrency" TEXT NOT NULL DEFAULT 'idr',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);
