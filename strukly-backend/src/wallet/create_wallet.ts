import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createWallet(
    userId: string,
    initialBalance: number = 0,
    walletCategory: string
) {
    try {
        const wallet = await prisma.wallet.create({
            data: {
                user_id: userId,          
                balance: initialBalance,  
                walletCategory: walletCategory, 
            },
        });
        return wallet;
    } catch (error) {
        console.error('Error creating wallet:', error);
        throw new Error(`Failed to create wallet: ${error}`);
    }
}