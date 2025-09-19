export enum ETransactionMethod {
    Cash = "cash",
    Debit = "debit",
    Credit = "credit",
    Qris = "qris",
}

export default class TransactionMethod {
    constructor(public readonly value: ETransactionMethod) {}
}