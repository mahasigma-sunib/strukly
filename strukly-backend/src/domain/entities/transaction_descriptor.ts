import TransactionID from "../values/transaction_id"

export type TransactionDescriptorProps = {
  id: TransactionID;
  vendor: string;
  categoryID: string;
  date: Date;
  subtotal: number;
  tax: number;
  total: number;
}

export default class TransactionDescriptor {
  public readonly id: TransactionID;
  public readonly vendor: string;
  public readonly categoryID: string;
  public readonly date: Date;
  public readonly subtotal: number;
  public readonly tax: number;
  public readonly total: number;

  constructor(props: TransactionDescriptorProps) {
    this.id = props.id;
    this.vendor = props.vendor;
    this.categoryID = props.categoryID;
    this.date = props.date;
    this.subtotal = props.subtotal;
    this.tax = props.tax;
    this.total = props.total;
  }

  static new(props: Omit<TransactionDescriptorProps, 'id'>): TransactionDescriptor {
    return new TransactionDescriptor({
      ...props,
      id: TransactionID.fromRandom(),
    });
  }
}
