import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

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
  res.json({});
};

export { createBook };
