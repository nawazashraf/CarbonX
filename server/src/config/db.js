import mongoose from "mongoose";
import { envConfig } from "./env.js";

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(
            envConfig.MONGO_URI
        );

        console.log(
            `MongoDB Connected: ${conn.connection.name}`
        );

    } catch (error) {

        console.error(
            `MongoDB Error: ${error.message}`
        );

        process.exit(1);
    }
};

export default connectDB;