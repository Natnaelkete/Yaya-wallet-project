import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";

// import routes from "./routes/index.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(hpp());

// app.use("/api", routes);

// app.use(notFound);
// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});

export default app;
