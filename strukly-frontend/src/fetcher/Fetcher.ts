export async function Fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url); //fetch is defaultly get request
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
//export const Fetcher = (url: string) => fetch(url).then(res => res.json);
