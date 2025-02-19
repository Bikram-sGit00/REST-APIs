import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  const { title, genre } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Type assertion
  const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1]; //splitting the mimetype and getting the second part of the array or we can do ".at(1)"...
  const fileName = files.coverImage[0].filename;
  // const filePath = path.resolve(__dirname, "../public/data/uploads", fileName);
  const filePath = path.resolve(
    __dirname,
    `../public/data/uploads/${fileName}`
  );
  const uploadFile = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-covers",
    format: coverImageMimeType,
  });
  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    `../public/data/uploads/${bookFileName}`
  );
  const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
    resource_type: "raw",
    filename_override: bookFileName,
    folder: "book-pdfs",
    format: "pdf",
  });
  const newBook = await bookModel.create({
    title,
    genre,
    author: "67b62ff795050caf9a923a14",
    coverImage: uploadFile.secure_url,
    file: uploadBookFile.secure_url,
  });

  // Delete the files after uploading to cloudinary
  await fs.promises.unlink(filePath);
  await fs.promises.unlink(bookFilePath);

  res.status(201).json({ id: newBook._id });
};

export { createBook };
