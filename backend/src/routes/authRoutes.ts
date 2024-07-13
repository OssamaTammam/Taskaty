import { Router } from "express";
import {
  isLoggedIn,
  logIn,
  logOut,
  signUp,
} from "../controller/authController";

const authRouter: Router = Router();

// No auth required
authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.get("/logout", logOut);
authRouter.post("/isLoggedIn", isLoggedIn);

export default authRouter;
