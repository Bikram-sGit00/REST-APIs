import mongoose from "mongoose";
import express from "express";
import { Todo } from "./models/TODO.js";

let a = await mongoose.connect("mongodb://localhost:27017/");

let app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
