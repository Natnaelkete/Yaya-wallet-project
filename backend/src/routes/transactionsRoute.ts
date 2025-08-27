import { Router } from "express";
import { getTransactions } from "../controllers/TransactionController.js";
import z from "zod";
import { validate } from "../middlewares/zodValidate.js";

export const router = Router();

const querySchema = z.object({
  query: z.object({
    q: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

router.get("/transactions", validate(querySchema), getTransactions);

export default router;
