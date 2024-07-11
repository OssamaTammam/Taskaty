import { Request } from "express";
import { User } from "@prisma/client";

/**
 * Extending the  request body adding an optional loggedInUser to pass in middleware
 */
declare global {
  namespace Express {
    interface Request {
      loggedInUser?: User;
    }
  }
}
