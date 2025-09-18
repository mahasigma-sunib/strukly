type TransactionCategories = 
    "food" |
    "entertainment" |
    "health" |
    "lifestyle"

export default class TransactionCategory {
    constructor(public readonly value: TransactionCategories) {}
}