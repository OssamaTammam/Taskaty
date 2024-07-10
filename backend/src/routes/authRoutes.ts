import { Router } from "express";
import { signUp } from "../controller/authController";

const authRouter: Router = Router();

// No auth required
authRouter.post("/signup", signUp);

export default authRouter;
