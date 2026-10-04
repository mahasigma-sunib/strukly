export default class ServiceUnavailableError extends Error {
  constructor(
    message = "Receipt scanning is temporarily unavailable. Please try again later.",
  ) {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}
