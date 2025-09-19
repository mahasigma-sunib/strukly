import useSWR from "swr";
import { Fetcher } from "../fetcher/Fetcher";
import useTransaction from "../store/TransactionStore";
import type { TransactionType } from "../type/TransactionType";
import { useEffect } from "react";

export default function useTransactionLoader() {
  const { data, error, isLoading } = useSWR<TransactionType[]>(
    "",
    Fetcher<TransactionType[]>
  );
  const { setItems, setError, setLoading } = useTransaction();

  useEffect(() => {
    setLoading(isLoading);
    if (error) setError("Failed to fetch transaction");
    if (data) setItems(data);
  }, [data, error, isLoading, setItems, setError, setLoading]);
}
