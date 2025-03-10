import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

//Global error handler is a special type of express construct that has four parameters, the first one is the error object, the second one is the request object, the third one is the response object, and the fourth one is the next function...

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  //@return
   res.status(statusCode).json({
    message: err.message, //used to send the error message to the client...
    errorStack:
      config.env === "development"
        ? err.stack
        : "Can't Show To Unauthorized User", //error stack gives us the whole information about the error...
  });
}; // "use" is used to register a middleware function with the application...

export default globalErrorHandler;
