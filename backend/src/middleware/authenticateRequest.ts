import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

/**
 * Authenticate the request body by adding the user onto it
 *
 * @param user
 * @returns
 */
const authenticateRequest = (user: User) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.loggedInUser = user;
    next();
  };
};

export default authenticateRequest;
