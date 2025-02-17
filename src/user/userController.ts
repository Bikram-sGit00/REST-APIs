import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body; //destructuring, will get the values in req and for getting it we use req.body...
  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "Please provide all the details");
    return next(error);
  }

  //database operation
  let newUser: User | null = null;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }
  } catch (err) {
    return next(
      createHttpError(500, "Server error while getting user details")
    );
  }

  //password hashing
  const hassedPassword = await bcrypt.hashSync(password, 10); //Here 10 is salt rounds,also in matter of salt rounds 10 is sweet spot...

  try {
    // const newUser = new userModel({ name, email, password: hassedPassword });  //OR
    newUser = await userModel.create({
      name,
      email,
      password: hassedPassword,
    }); //create is a mongoose method which will create a new document in the collection...
  } catch (err) {
    return next(createHttpError(500, "Server error @password hashing"));
  }

  try {
    //JWT token generation
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d", //    ^
      algorithm: "HS256", // |----> these are the options which we can pass to sign method,also we can leave it empty it will take default values...
    }); //                   |----> sub is a subject,which is a standard claim of JWT token,which is used to identify the subject of the JWT token...
    //sign is a method from jsonwebtoken module,which will generate a token...

    //process
    //response
    res.send(201).json({ accessToken: token }); //sending the token as a response...
  } catch (err) {
    return next(createHttpError(500, "Server error @JWT token generation"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = createHttpError(400, "Please provide all the details");
    return next(error);
  }
  let user: User | null = null;
  try {
    //check for existing user
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "user not found"));
    }
  } catch (err) {
    return next(
      createHttpError(500, "Server error while getting user details")
    );
  }
  const ismatch = await bcrypt.compare(password, user.password); //compare is a method from bcrypt module,which will compare the password with the hashed password...
  if (!ismatch) {
    return next(createHttpError(401, "Invalid credentials"));
  }
  // create a JWT token
  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.json({ accessToken: token });
};

export { createUser, loginUser };
