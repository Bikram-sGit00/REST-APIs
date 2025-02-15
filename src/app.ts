import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res, next) => {
  //   // throw new Error("we can throw error in JS like this");
  //   const error = createHttpError(500, "Own Error");
  //   throw error;
  res.json({ message: "Welcome!" });
});

app.use(globalErrorHandler);

export default app;
