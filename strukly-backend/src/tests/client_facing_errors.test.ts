import { ZodError } from "zod";
import { errorMiddleware } from "../infrastructure/middleware/error_middleware";
import ServiceUnavailableError from "../domain/errors/ServiceUnavailableError";
import UnprocessableReceiptError from "../domain/errors/UnprocessableReceiptError";
import { toClientFacingError } from "../infrastructure/language_model/client_facing_errors";

describe("toClientFacingError", () => {
  it("maps unknown errors to ServiceUnavailableError", () => {
    expect(() => toClientFacingError(new Error("unauthorized"))).toThrow(
      ServiceUnavailableError,
    );
  });

  it("maps JSON parse failures to UnprocessableReceiptError", () => {
    expect(() => toClientFacingError(new SyntaxError("unexpected token"))).toThrow(
      UnprocessableReceiptError,
    );
  });

  it("maps schema validation failures to UnprocessableReceiptError", () => {
    expect(() => toClientFacingError(new ZodError([]))).toThrow(
      UnprocessableReceiptError,
    );
  });
});

describe("errorMiddleware", () => {
  const createResponse = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res;
  };

  it("returns 422 for UnprocessableReceiptError", () => {
    const res = createResponse();
    const next = jest.fn();

    errorMiddleware(new UnprocessableReceiptError(), {} as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: "Could not extract valid expense data from the image.",
    });
  });

  it("returns 503 for ServiceUnavailableError", () => {
    const res = createResponse();
    const next = jest.fn();

    errorMiddleware(new ServiceUnavailableError(), {} as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: "Receipt scanning is temporarily unavailable. Please try again later.",
    });
  });

  it("does not expose provider error details", () => {
    const res = createResponse();
    const next = jest.fn();

    errorMiddleware(
      new Error("OpenRouter request failed: secret details"),
      {} as never,
      res as never,
      next,
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
