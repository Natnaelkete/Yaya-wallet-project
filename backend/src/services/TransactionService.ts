import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const YAYA_API_BASE = "https://sandbox.yayawallet.com/api/en/transaction";

export interface TransactionDTO {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause: string;
  createdAt: string;
  incoming: boolean;
}

export const fetchTransactions = async (
  query?: string
): Promise<TransactionDTO[]> => {
  const response = query
    ? await axios.post(
        `${YAYA_API_BASE}/search`,
        { query },
        {
          headers: {
            "X-API-KEY": process.env.YAYA_API_KEY,
            "X-API-SECRET": process.env.YAYA_API_SECRET,
          },
        }
      )
    : await axios.get(`${YAYA_API_BASE}/find-by-user`, {
        headers: {
          "X-API-KEY": process.env.YAYA_API_KEY,
          "X-API-SECRET": process.env.YAYA_API_SECRET,
        },
      });

  let transactions: TransactionDTO[] = response.data.transactions || [];

  transactions = transactions.map((tx) => ({
    ...tx,
    incoming: tx.receiver === tx.sender,
  }));

  // Cache in Postgres
  await prisma.transactionCache.createMany({
    data: transactions.map((tx) => ({
      id: tx.id,
      sender: tx.sender,
      receiver: tx.receiver,
      amount: tx.amount,
      currency: tx.currency,
      cause: tx.cause,
      createdAt: new Date(tx.createdAt),
      incoming: tx.incoming,
    })),
    skipDuplicates: true,
  });

  return transactions;
};
