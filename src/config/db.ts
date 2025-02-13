import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.databaseUrl as string) // string is used to tell the ts compiler that the value will surely come , this is called type casting...
    
    } catch (error) {
        console.log("Error connecting to the database", error);
        
    }
}





