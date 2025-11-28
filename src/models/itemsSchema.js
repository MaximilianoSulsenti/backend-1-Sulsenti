 import mongoose from "mongoose";

   const userCollection = "usuarios";

    const itemSchema = new mongoose.Schema({
      
     first_name: string,
      last_name: string,
      email :{
        type: String,
        required: true,
        unique: true
      }
    });

    export const UserModel = mongoose.model(userCollection, itemSchema);
