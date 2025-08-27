import type { Transaction } from "../App";
import { sampleTransactions } from "../data/sampleData";

type PageResp = {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
};

/**
 * Mock fetch function to simulate a backend API.
 */
export async function fetchTransactions(
  q: string,
  page: number,
  pageSize: number
): Promise<PageResp> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter by query (search sender, receiver, cause, or id)
  const filtered = sampleTransactions.filter((t) => {
    const searchStr = q.toLowerCase();
    return (
      t.sender.toLowerCase().includes(searchStr) ||
      t.receiver.toLowerCase().includes(searchStr) ||
      t.cause?.toLowerCase().includes(searchStr) ||
      t.id.includes(searchStr)
    );
  });

  const total = filtered.length;

  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return { items, page, pageSize, total };
}
