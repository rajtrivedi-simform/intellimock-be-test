import { Router } from "express";
import { userLogin, userRegister } from "../controllers/user.controller";

const router = Router();

// router.route("/login").post(userLogin);
router.post("/login", userLogin);
router.post("/register", userRegister);

export default router;
