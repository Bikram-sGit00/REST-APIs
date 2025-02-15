import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body; //destructuring, will get the values in req and for getting it we use req.body...
  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "Please provide all the details");
    return next(error);
  }
  //database operation
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User already exists");
    return next(error);
  }
  //password hashing
  const hassedPassword =await bcrypt.hashSync(password, 10);//Here 10 is salt rounds,also in matter of salt rounds 10 is sweet spot...
  //process
  //response
  res.json({ message: "User created successfully!" });
};

export { createUser };
