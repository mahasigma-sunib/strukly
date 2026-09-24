import axios from "axios";

/**
 * Extract a human-readable message from an API error.
 * Falls back to `fallback` when the error carries no server message.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: unknown; message?: unknown }
      | undefined;
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }
  }
  return fallback;
}
