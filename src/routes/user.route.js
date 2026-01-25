import { Router } from "express";
import passport from "passport";
import { authorizeRole } from "../middlewares/auth.js";

export default function createUserRouter(userManager) {
    const router = Router();

    // GET para obtener todos los usuarios o un usuario por ID
    router.get("/", passport.authenticate("current", { session: false }), authorizeRole("admin"),
     async (req, res) => {
        try {
            const users = await userManager.getUsers();

            const usersWithoutPassword = users.map(u => {
            const { password, ...rest } = u;
           return rest;
           });

            res.status(200).json({ status: "success", payload: usersWithoutPassword });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    });

    router.get("/:uid", async (req, res) => {
        try {
            const user = await userManager.getUserById(req.params.uid);
            if (!user) {
                return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
            }
            res.status(200).json({ status: "success", payload: user });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    });

    // POST para crear un nuevo usuario con Passport 
    router.post("/register", (req, res, next) => {
       passport.authenticate("register", { session: false }, (err, user, info) => {
         if (err)
           return res.status(500).json({ status: "error", error: err.message });
     
         if (!user)
           return res.status(400).json({ status: "error", error: info.message || "Error en el registro" });
     
         res.status(201).json({status: "success",message: "Usuario registrado correctamente", });
       })(req, res, next);
     });

    // PUT para actualizar un usuario existente
    router.put("/:uid", async (req, res) => {
        try {
            const updatedUser = await userManager.updateUser(req.params.uid, req.body);
            if (!updatedUser) {
                return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
            }
            res.status(200).json({ status: "success", payload: updatedUser });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    });

    // DELETE para eliminar un usuario
    router.delete("/:uid", async (req, res) => {
        try {
            const deletedUser = await userManager.deleteUser(req.params.uid);
            if (!deletedUser) {
                return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
            }
            res.status(200).json({ status: "success", message: "Usuario eliminado" });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    });

    return router;
}
