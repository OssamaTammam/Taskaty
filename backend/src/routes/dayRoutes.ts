import { Router } from "express";
import { protectRoute } from "../controller/authController";
import { deleteDay, getDay } from "../controller/dayController";

const dayRouter: Router = Router();

// Auth required
dayRouter.use(protectRoute);
dayRouter.route("").get(getDay).delete(deleteDay);

export default dayRouter;
