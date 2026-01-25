import { config } from "dotenv";
config();

export const env = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY
}