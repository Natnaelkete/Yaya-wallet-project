import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      console.log("Zod error", err);
      next(err);
    }
  };
