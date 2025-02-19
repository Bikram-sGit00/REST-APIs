import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"), // Path to store uploaded files(multer will create the folder if it doesn't exist)...
});

bookRouter.post("/", () => {}, createBook);

export default bookRouter;
