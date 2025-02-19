import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>(
  {
    //We don't need to define the _id field, it is automatically created by MongoDB...
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Book>("Book", bookSchema); //"here "BOOK" is the name of the collection in the database"
