import mongoose from "mongoose";
import { env } from "../config/environment.js";

export async function mongoConnect(){
   await mongoose.connect(env.MONGO_URI);
}