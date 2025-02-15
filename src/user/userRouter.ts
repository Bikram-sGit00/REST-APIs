import express from "express";

const userRouter = express.Router();

//post request to create a user...
userRouter.post("/register", (req, res) => {
  res.json({ message: "User register" });
});

export default userRouter;
