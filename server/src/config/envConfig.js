import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development"
};

if (!envConfig.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
}

if (!envConfig.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
}