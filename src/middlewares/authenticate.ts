import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) return next(createHttpError({ message: "Access Denied" }));
  try {
    const parsedToken = token.split(" ")[1]; //splitting the token with space and getting the second part of the array
    const decodedToken = jwt.verify(parsedToken, config.jwtSecret as string);

    const _req = req as Request & { userId: string };
    _req.userId = decodedToken.sub as string;
  } catch (error) {
    next(createHttpError({ message: "TokenExpired" }));
  }

  next();
};

export default authenticate;
