import type { Transaction } from "../App";

export const sampleTransactions: Transaction[] = [
  {
    id: "1",
    sender: "Alice",
    receiver: "Bob",
    amount: 120,
    currency: "USD",
    createdAt: "2025-08-01T10:00:00Z",
  },
  {
    id: "2",
    sender: "Charlie",
    receiver: "Dave",
    amount: 80,
    currency: "USD",
    createdAt: "2025-08-02T12:30:00Z",
  },
  {
    id: "3",
    sender: "Alice",
    receiver: "Eve",
    amount: 200,
    currency: "USD",
    createdAt: "2025-08-02T15:00:00Z",
  },
  {
    id: "4",
    sender: "Bob",
    receiver: "Frank",
    amount: 50,
    currency: "USD",
    createdAt: "2025-08-03T09:45:00Z",
  },
  {
    id: "5",
    sender: "Eve",
    receiver: "Alice",
    amount: 300,
    currency: "USD",
    createdAt: "2025-08-04T11:20:00Z",
  },
];
