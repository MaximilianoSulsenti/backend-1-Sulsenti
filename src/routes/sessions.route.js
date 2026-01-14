import { Router } from "express";
import passport from "passport";
import { generateToken, authToken } from "../utils/jwt.js";

const router= Router();

router.post("/login", passport.authenticate("login", { session: false }), (req, res) => {
    const user = req.user;
    const token = generateToken(user);

    res.status(200).json({ status: "success", payload: { token } });
});

router.get("/current", authToken, (req, res) => {
    res.status(200).json({ status: "success", payload: req.user });
});

export default router;