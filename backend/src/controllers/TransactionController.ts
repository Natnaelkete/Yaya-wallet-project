import { Request, Response } from "express";
import {
  fetchTransactions,
  TransactionDTO,
} from "../services/TransactionService";

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { p = "1", query = "" } = req.query;
    const page = parseInt(p as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const transactions: TransactionDTO[] = await fetchTransactions(
      query as string
    );

    const paginated = transactions.slice(offset, offset + limit);

    res.json({
      page,
      total: transactions.length,
      data: paginated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
