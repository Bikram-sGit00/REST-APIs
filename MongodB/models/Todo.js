import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: String,
  desc: String,
  isDone: Boolean,
});

export const Todo = mongoose.model("Todo", TodoSchema);

// export default mongoose.model("Todo", TodoSchema);
