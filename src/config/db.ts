import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.databaseUrl as string) // string is used to tell the ts compiler that the value will surely come , this is called type casting...

        mongoose.connection.on("connected", () => {  //Mongoose returns some events like connected, error, disconnected, etc. & We can listen to these events...
            console.log("Connected to the database");  
        });
        mongoose.connection.on("error", (err) => { //
            console.log("Error connecting to the database in future", err);
        });
    
    } catch (error) {
        console.log("Error connecting to the database", error);
        process.exit(1); // status code 1 is used to tell the process that it has ended with an error...
        
    }
}

export default connectDB;