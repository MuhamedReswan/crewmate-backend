import mongoose from "mongoose";
import { MONGODBURL } from "./env";

export const connectDB = async () =>{
    try {
        await mongoose.connect(MONGODBURL ?? "")
        console.log("Database connected");
        
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);

    }
}

