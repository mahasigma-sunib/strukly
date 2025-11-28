-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "myAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userID" TEXT NOT NULL,
    "members" JSONB,

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
    "assignedMember" TEXT,
    "expenseID" TEXT NOT NULL,

    CONSTRAINT "ExpenseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" TEXT NOT NULL,
    "userID" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "expense_method" TEXT NOT NULL DEFAULT 'cash',
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "balanceCurrency" TEXT NOT NULL DEFAULT 'idr',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."ExpenseHeader" ADD CONSTRAINT "ExpenseHeader_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseItem" ADD CONSTRAINT "ExpenseItem_expenseID_fkey" FOREIGN KEY ("expenseID") REFERENCES "public"."ExpenseHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
