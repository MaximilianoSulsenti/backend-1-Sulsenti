import { Router } from "express";
import passport from "passport";
import { generateToken} from "../utils/jwt.js";

const router= Router();

router.post("/login", passport.authenticate("login", { session: false }), (req, res) => {
    const user = req.user;
    const token = generateToken(user);

    res.status(200).json({ status: "success", payload: { token } });
});

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    const user = req.user.toObject();
    delete user.password;

    res.status(200).json({ status: "success", payload: user });
});

export default router;