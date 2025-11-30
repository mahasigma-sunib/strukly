import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./infrastructure/routes/auth_route";
import { goalItemRouter } from "./infrastructure/routes/goal_item_route";
import { expenseRouter } from "./infrastructure/routes/expense_route";
import { budgetRouter } from "./infrastructure/routes/budget_route";
import { errorMiddleware } from "./infrastructure/middleware/error_middleware";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api", authRouter);
app.use("/api", goalItemRouter);
app.use("/api", expenseRouter);
app.use("/api/budget", budgetRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware - must be registered after all routes
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
