import express from "express";
import { createBook, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../public/data/uploads"), // Path to store uploaded files(multer will create the folder if it doesn't exist)...
  limits: { fileSize: 3e7 }, //3e7 bytes = 30MB (30 X 7 times 10);
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);
bookRouter.patch(
  "/:bookId", // We use : in express to indicate a dynamic route...
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

export default bookRouter;
