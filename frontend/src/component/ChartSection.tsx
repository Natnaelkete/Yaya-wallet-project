import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchTransactions } from "../utils/fetchTransactionChart";
import type { Transaction } from "../App";

type PageResp = {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
};

export default function ChartSection() {
  const [data, setData] = useState<PageResp | null>(null);

  useEffect(() => {
    fetchTransactions().then((res) => setData(res));
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, number>();
    for (const t of data.items) {
      const d = new Date(t.createdAt).toISOString().slice(0, 10);
      map.set(d, (map.get(d) || 0) + t.amount);
    }
    return Array.from(map.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));
  }, [data]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      <h2 className="text-sm font-medium mb-2">Amount over time</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
