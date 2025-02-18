import { User } from "../src/user/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  price: number;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
