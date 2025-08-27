import { motion } from "framer-motion";
import TransactionsTable from "./TransactionsTable";
import type { Transaction } from "../App";

type PageResp = {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
};

type TransactionsSectionProps = {
  data: PageResp | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
};

export default function TransactionsSection({
  data,
  loading,
  error,
  page,
  setPage,
  pageSize,
  setPageSize,
}: TransactionsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      <TransactionsTable
        data={data}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </motion.section>
  );
}
