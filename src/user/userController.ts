import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body; //destructuring, will get the values in req and for getting it we use req.body...
  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "Please provide all the details");
    return next(error);
  }
  //process
  //response
  res.json({ message: "User created successfully!" });
};

export { createUser };
