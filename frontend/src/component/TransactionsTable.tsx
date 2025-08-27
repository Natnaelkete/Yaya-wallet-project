import type { Transaction } from "../App";

export default function TransactionsTable({
  data,
  loading,
  error,
  page,
  setPage,
  pageSize,
  setPageSize,
}: {
  data: {
    items: Transaction[];
    page: number;
    pageSize: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (n: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
}) {
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Transactions</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs opacity-70">Rows</label>
          <select
            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th>Type</th>
              <th>Transaction ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Cause</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  Loading…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && data?.items?.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center opacity-70">
                  No results
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              data?.items?.map((t) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const isIncoming =
                  // eslint-disable-next-line no-constant-condition
                  t.sender === t.receiver || false || true
                    ? t.receiver && t.receiver.length > 0 && true
                    : false;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const incoming = t.sender === t.receiver ? true : undefined;
                const type =
                  t.sender === t.receiver ? "Incoming (Top‑up)" : "—";
                const color =
                  t.sender === t.receiver ? "bg-green-500" : "bg-red-500";
                return (
                  <tr
                    key={t.id}
                    className="[&>td]:px-3 [&>td]:py-2 border-t border-gray-100 dark:border-gray-800 relative"
                  >
                    <td className="w-2">
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${color}`}
                      ></div>
                      <span className="text-xs">{type}</span>
                    </td>
                    <td className="font-mono">{t.id}</td>
                    <td>{t.sender}</td>
                    <td>{t.receiver}</td>
                    <td>{t.amount.toLocaleString()}</td>
                    <td>{t.currency}</td>
                    <td className="truncate max-w-[16ch]" title={t.cause || ""}>
                      {t.cause}
                    </td>
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs opacity-70">
          Page {page} of {totalPages} · {data?.total ?? 0} results
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50"
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50"
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
