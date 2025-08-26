import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message: string | string[] = err.message || "Internal Server Error";

  // Handle Mongoose bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = 404;
  }

  // Handle Zod validation error
  else if (err instanceof ZodError) {
    message = err.issues.map((e) => e.message);
    statusCode = 400;
  }

  // Handle Mongoose validation error
  else if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Handle duplicate key error (MongoDB)
  else if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // Handle JWT expired
  else if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  // Handle JWT invalid
  else if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  // Handle unexpected TypeError
  else if (err instanceof TypeError) {
    message = "An unexpected error occurred";
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { notFound, errorHandler };
