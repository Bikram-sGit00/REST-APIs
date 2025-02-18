import { Request, Response, NextFunction } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: "Book created successfully" });
  } catch (error) {
    next(error);
  }
};

export { createBook };