export interface TransactionDTO {
  id: string;
  vendor: string;
  categoryID: string;
  date: string; // ISO string
  subtotal: number;
  tax: number;
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    singlePrice: number;
    transactionID: string;
  }[];
}

export function transactionToDTO(transaction: any): TransactionDTO {
  return {
    id: transaction.descriptor.id.id,
    vendor: transaction.descriptor.vendor,
    categoryID: transaction.descriptor.categoryID,
    date: transaction.descriptor.date.toISOString(),
    subtotal: transaction.descriptor.subtotal,
    tax: transaction.descriptor.tax,
    total: transaction.descriptor.total,
    items: transaction.items.map((item: any) => ({
      id: item.id.id,
      name: item.name,
      quantity: item.quantity,
      singlePrice: item.singlePrice.amount,
      transactionID: item.transactionID.id,
    })),
  };
}