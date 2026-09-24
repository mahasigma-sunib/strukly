/**
 * Shared SWR fetcher. Throws on non-2xx responses so HTTP errors
 * surface through SWR's `error` state, not just network failures.
 */
export async function fetcher(url: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}
