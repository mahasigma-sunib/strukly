export default class UnprocessableReceiptError extends Error {
  constructor(
    message = "Could not extract valid expense data from the image.",
  ) {
    super(message);
    this.name = "UnprocessableReceiptError";
  }
}
