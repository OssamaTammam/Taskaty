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
import { hashPassword, verifyPassword } from "../utils/auth/passwordHashing";
import { createJWT } from "../utils/auth/tokens";

/**
 * Handles user registration.
 *
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
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Empty fields
    if (!req.body.username || !req.body.password || !req.body.email) {
      return resGenerator(
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
      return resGenerator(
        res,
        400,
        "fail",
        "Invalid info username must be 4 characters or more, password must be 8 characters or more",
      );
    }

    // check if valid email address
    if (!checkEmailSpecification(req.body.email)) {
      return resGenerator(res, 400, "fail", "Invalid email address");
    }

    // check if user already exists
    if (await checkUserExits(req.body.email, req.body.username)) {
      return resGenerator(
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

    return resGenerator(
      res,
      200,
      "success",
      `User created successfully with username: ${newUser.username} and email: ${newUser.email}`,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user login.
 *
 * 1. Checks for empty email or password inputs.
 * 2. Retrieves user data from the database based on the provided email.
 * 3. Verifies if the provided password matches the hashed password stored in the database.
 * 4. Generates a JWT token and stores it in the database for authenticated sessions.
 * 5. Sends appropriate success or error responses based on the login attempt.
 *
 * @param req - The request object containing the user's login credentials.
 * @param res - The response object used to send the response back to the client.
 * @param next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check for empty inputs
    if (!req.body.email || !req.body.password) {
      resGenerator(res, 400, "fail", "Email or password cannot be empty");
    }

    // Fetch the data from the db
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return resGenerator(res, 400, "fail", "User doesn't exist");
    }

    // Check if the inputted password is correct
    const isCorrectPassword = await verifyPassword(
      req.body.password,
      user.password,
    );

    // Incorrect password
    if (!isCorrectPassword) {
      return resGenerator(res, 400, "fail", "Email or password is incorrect");
    }

    // Create jwt and store it in the db
    const jwt: string = await createJWT(user.id, res);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        jwt,
      },
    });

    return resGenerator(res, 200, "success", `logged in as ${user.username}`);
  } catch (err) {
    next(err);
  }
};
