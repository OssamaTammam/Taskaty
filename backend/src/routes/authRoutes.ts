import { Router } from "express";
import { logIn, signUp } from "../controller/authController";

const authRouter: Router = Router();

// No auth required
authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);

export default authRouter;
