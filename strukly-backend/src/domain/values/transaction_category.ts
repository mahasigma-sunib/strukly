type TransactionCategories = 
    "food" |
    "entertainment" |
    "health" |
    "lifestyle"

export default class TransactionCategory {
    constructor(public readonly value: TransactionCategories) {}
    static fromString(value: string): TransactionCategory {
        const validCategories: TransactionCategories[] = ["food", "entertainment", "health", "lifestyle"];
        if (validCategories.includes(value as TransactionCategories)) {
            return new TransactionCategory(value as TransactionCategories);
        }
        throw new Error(`Invalid transaction category: ${value}`);
    }
}