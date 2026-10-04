import axios from "axios";
import i18n from "../i18n";

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
      return i18n.t("common.networkError");
    }
  }
  return fallback;
}
