import { Router } from "express";
import { getTransactions } from "../controllers/TransactionController.js";

export const router = Router();

router.get("/transactions", getTransactions);

export default router;
