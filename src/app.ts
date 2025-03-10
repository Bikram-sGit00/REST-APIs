import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontendDomain,
  })
);
app.use(express.json()); //middleware to parse Json data,by defalut it is disabled in express...

app.get("/", (req, res, next) => {
  //   // throw new Error("we can throw error in JS like this");
  //   const error = createHttpError(500, "Own Error");
  //   throw error;
  res.json({ message: "Welcome!" });
});
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use(globalErrorHandler);

export default app;
