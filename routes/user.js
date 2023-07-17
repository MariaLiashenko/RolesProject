import express from "express";
import { list, login, register, changeBoss } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/list", verifyToken, list);
router.post("/changeBoss", verifyToken, changeBoss);

export default router;
