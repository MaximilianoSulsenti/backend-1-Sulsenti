import userModel from "../models/user.model.js";

export default class UserManager {

    // Obtener todos los usuarios
    async getUsers() {
        return await userModel.find().lean();
    }

    // Obtener usuario por ID
    async getUserById(uid) {
        return await userModel.findById(uid).lean();
    }

    async createUser(userData) {
        return await userModel.create(userData);
    }

    async updateUser(uid, updateData) {
        return await userModel.findByIdAndUpdate(uid,updateData,{ new: true }).lean();
    }

    async deleteUser(uid) {
        return await userModel.findByIdAndDelete(uid);
    }
}
