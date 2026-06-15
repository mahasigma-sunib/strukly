export type ReceiptExtractionTask = {
  imageBase64: string;
  mimeType: string;
  instructions: string;
  outputJsonSchema: Record<string, unknown>;
};
