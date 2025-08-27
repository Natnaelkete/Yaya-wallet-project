import { useEffect, useState } from "react";
import useDarkMode from "./hooks/useDarkmood";
import Header from "./component/Header";
import ChartSection from "./component/ChartSection";
import TransactionsSection from "./component/TransactionSection";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export type Transaction = {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause?: string | null;
  createdAt: string;
};

type PageResp = {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
};

export default function App() {
  const { dark, setDark } = useDarkMode();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<PageResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const resp = await fetch(
        `${API_BASE}/api/transactions?` + params.toString()
      );
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.message || "Failed to fetch");
      setData(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [q, page, pageSize]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header
        q={q}
        setQ={setQ}
        setPage={setPage}
        dark={dark}
        setDark={setDark}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <ChartSection />
        <TransactionsSection
          data={data}
          loading={loading}
          error={error}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </main>
    </div>
  );
}
