import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import transactionRoute from "./routes/transactionsRoute";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(hpp());

app.use("/api", transactionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});

export default app;
