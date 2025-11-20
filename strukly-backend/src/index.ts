import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./infrastructure/routes/auth_route";
import { expenseRouter } from "./infrastructure/routes/expense_route";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api", authRouter);
app.use("/api", expenseRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
