import ServiceUnavailableError from "src/domain/errors/ServiceUnavailableError";
import UnprocessableReceiptError from "src/domain/errors/UnprocessableReceiptError";
import { ZodError } from "zod";

export function toClientFacingError(err: unknown): never {
  if (
    err instanceof ServiceUnavailableError ||
    err instanceof UnprocessableReceiptError
  ) {
    throw err;
  }

  if (err instanceof SyntaxError || err instanceof ZodError) {
    throw new UnprocessableReceiptError();
  }

  if (err instanceof Error && err.message === "OpenRouter returned empty response") {
    throw new UnprocessableReceiptError();
  }

  throw new ServiceUnavailableError();
}
