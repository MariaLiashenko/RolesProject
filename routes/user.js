import express from "express";
import { list, login, register, changeBoss } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/list", verifyToken, list);
router.get("/changeBoss", verifyToken, changeBoss);

router.post("/welcome", verifyToken, (req, res) => {
    console.log(req.user);
    res.status(200).send("Welcome 🙌 ");
});

export default router;
