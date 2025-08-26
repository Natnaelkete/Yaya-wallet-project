import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/TransactionService.js";

export async function getTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = (req.query.q as string) || undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

    const data = await TransactionService.fetchTransactions({
      q,
      page,
      pageSize,
    });
    console.log("*************Data from transaction", data);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
