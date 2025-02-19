import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../public/data/uploads"), // Path to store uploaded files(multer will create the folder if it doesn't exist)...
  limits: { fileSize: 3e7 }, //3e7 bytes = 30MB (30 X 7 times 10);
});

bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
