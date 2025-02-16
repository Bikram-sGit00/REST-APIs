import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

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
  const hassedPassword = await bcrypt.hashSync(password, 10); //Here 10 is salt rounds,also in matter of salt rounds 10 is sweet spot...

  // const newUser = new userModel({ name, email, password: hassedPassword });  //OR
  const newUser = await userModel.create({
    name,
    email,
    password: hassedPassword,
  }); //create is a mongoose method which will create a new document in the collection...

  //JWT token generation
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d", //    ^
    algorithm: "HS256", // |----> these are the options which we can pass to sign method...
  }); //                   |----> sub is a subject,which is a standard claim of JWT token,which is used to identify the subject of the JWT token...
  //sign is a method from jsonwebtoken module,which will generate a token...

  //process
  //response
  res.json({ accessToken: token }); //sending the token as a response...
};

export { createUser };
