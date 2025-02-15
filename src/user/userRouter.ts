import express from "express";
import { createUser } from "./userController";

const userRouter = express.Router();

//post request to create a user...
userRouter.post("/register",createUser); 


export default userRouter;
