import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prismaClient";
import {
  checkUserExits,
  checkEmailSpecification,
  checkUsernamePasswordSpecification,
  UserData,
} from "../model/userModel";
import resGenerator from "../utils/resGenerator";
import { User } from "@prisma/client";
import { hashPassword } from "../utils/auth/passwordHashing";

/**
 * Handles user registration.
 *
 * This function performs the following steps:
 * 1. Checks if all necessary fields are not empty
 * 2. Checks if the user already exists based on email or username.
 * 3. Validates the username,password specifications and email address.
 * 4. Creates a new user if all validations pass.
 * 5. Sends appropriate success or error responses.
 *
 * @param req - The request object containing the user's registration data.
 * @param res - The response object used to send the response back to the client.
 * @param next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws Will pass errors to the next middleware function.
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Empty fields
    if (!req.body.username || !req.body.password || !req.body.email) {
      resGenerator(
        res,
        400,
        "fail",
        "Email, password or username cannot be empty",
      );
    }

    // check for username and password specifications
    if (
      !checkUsernamePasswordSpecification(req.body.username, req.body.password)
    ) {
      resGenerator(
        res,
        400,
        "fail",
        "Invalid info username must be 4 characters or more, password must be 8 characters or more",
      );
    }

    // check if valid email address
    if (!checkEmailSpecification(req.body.email)) {
      resGenerator(res, 400, "fail", "Invalid email address");
    }

    // check if user already exists
    if (await checkUserExits(req.body.email, req.body.username)) {
      resGenerator(
        res,
        400,
        "fail",
        "User already exists change username or email",
      );
    }

    // information correct start creating the user
    const userData: UserData = {
      username: req.body.username,
      password: await hashPassword(req.body.password),
      email: req.body.email,
    };

    const newUser: User = await prisma.user.create({
      data: userData,
    });

    resGenerator(
      res,
      200,
      "success",
      `User created successfully with username: ${newUser.username} and email: ${newUser.email}`,
    );
  } catch (err) {
    next(err);
  }
};
