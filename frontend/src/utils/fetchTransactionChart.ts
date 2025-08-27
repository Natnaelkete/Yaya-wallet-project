import { sampleTransactions } from "../data/sampleData";

/**
 * Mock fetch function to simulate a backend API.
 */
export async function fetchTransactions() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filtered = sampleTransactions.filter((t) => {
    return t.sender || t.receiver || t.cause || t.id;
  });

  const total = filtered.length;

  const items = filtered;

  return { items, total };
}
