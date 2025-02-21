import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import createHttpError from "http-errors";

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
  const _req = req as Request & { userId: string };
  const newBook = await bookModel.create({
    title,
    genre,
    author: _req.userId,
    coverImage: uploadFile.secure_url,
    file: uploadBookFile.secure_url,
  });

  // Delete the files after uploading to cloudinary
  await fs.promises.unlink(filePath);
  await fs.promises.unlink(bookFilePath);

  res.status(201).json({ id: newBook._id });
};
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId; // params is an object that contains the dynamic route parameters...
  const book = await bookModel.findOne({ _id: bookId });
  // const book = await bookModel.findById(bookId);

  if (!book) {
    return next({ message: "Book not found", status: 404 });
  }
  const _req = req as Request & { userId: string };
  if (book.author.toString() !== _req.userId) {
    return next({ message: "You can't Update Others Book", status: 403 });
  }
  //update cover image
  let completeCoverImage = "";
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Type assertion
  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1]; //splitting the mimetype and getting the second part of the array or we can do ".at(1)"...
    const fileName = files.coverImage[0].filename;
    // const filePath = path.resolve(__dirname, "../public/data/uploads", fileName);
    const filePath = path.resolve(
      __dirname,
      `../public/data/uploads/${fileName}`
    );
    completeCoverImage = fileName;
    const uploadFile = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    completeCoverImage = uploadFile.secure_url;
  }
  //update book file
  let completeBookFile = "";
  if (files.file) {
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      `../public/data/uploads/${bookFileName}`
    );
    completeBookFile = bookFileName;

    const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeBookFile,
      folder: "book-pdfs",
      format: "pdf",
    });
    completeBookFile = uploadBookFile.secure_url;
    await fs.promises.unlink(bookFilePath);
  }
  const updateBook = await bookModel.findOneAndUpdate(
    { _id: bookId }, //filter
    {
      title,
      genre,
      coverImage: completeCoverImage || book.coverImage,
      file: completeBookFile || book.file,
    }, //update
    { new: true }
  );
  res.json(updateBook);
};
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find().populate("author", "name email");
    res.json(books);
  } catch (error) {
    return next(createHttpError(500, "Error While Getting Books"));
  }
};
const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book Not Found"));
    }
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error While Getting Book"));
  }
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book Not Found While Deleting"));
  }
  const _req = req as Request & { userId: string };
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can't Delete Others Book"));
  }
  const coverFileSplit = book.coverImage.split("/");
  const publicCoverFile =
    coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split(".").at(-2);

  const bookFileSplit = book.file.split("/");
  const publicBookFile = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
  try {
    await cloudinary.uploader.destroy(publicCoverFile);
    await cloudinary.uploader.destroy(publicBookFile, { resource_type: "raw" }); // only for pdf
    await bookModel.deleteOne({ _id: bookId });
    res.status(204).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    return next(createHttpError(500, "Error While Deleting Book"));
  }
};

export { createBook, updateBook, listBooks, getSingleBook, deleteBook };
