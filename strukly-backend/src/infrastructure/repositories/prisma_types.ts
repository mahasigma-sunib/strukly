import { Prisma, PrismaClient } from "src/generated/prisma/client";

export type PrismaClientLike = PrismaClient | Prisma.TransactionClient;
