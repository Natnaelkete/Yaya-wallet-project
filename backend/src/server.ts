import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import transactionRouter from "./routes/transactionsRoute";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { rateLimiter } from "./middlewares/rateLimiter";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(hpp());

app.use("/api", rateLimiter);

app.use("/api", transactionRouter);

app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});

export default app;
