import { Router } from "express";
import { protectRoute } from "../controller/authController";
import {
  addJournal,
  deleteJournal,
  updateJournal,
} from "../controller/journalController";

const journalRouter = Router();

// Auth required
journalRouter.use(protectRoute);
journalRouter
  .route("")
  .post(addJournal)
  .delete(deleteJournal)
  .put(updateJournal);

export default journalRouter;
