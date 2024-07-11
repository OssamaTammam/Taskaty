import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prismaClient";
import {
  checkEmailSpecification,
  checkUsernamePasswordSpecification,
  UserData,
} from "../model/userModel";
import resGenerator from "../utils/resGenerator";
import { User } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/auth/passwordHashing";
import { createJWT, verifyJWT } from "../utils/auth/tokens";
import authenticateRequest from "../middleware/authenticateRequest";

/**
 * @param email
 * @param username
 * @returns boolean that checks if the user exists as a registered user in the database
 */
export const checkUserExits = async (
  email: string,
  username: string,
): Promise<boolean> => {
  try {
    // check if username exists
    if (
      await prisma.user.findFirst({
        where: {
          username: username,
        },
      })
    )
      return true;

    // check if email exists
    if (
      await prisma.user.findFirst({
        where: {
          email: email,
        },
      })
    )
      return true;

    return false;
  } catch (err) {
    throw new Error("Error checking if user exits\n" + err);
  }
};

/**
 * @param email
 * @param username
 * @returns boolean that checks if the user exists as a registered user in the database
 */
export const checkUserExits = async (
  email: string,
  username: string,
): Promise<boolean> => {
  try {
    // check if username exists
    if (
      await prisma.user.findFirst({
        where: {
          username: username,
        },
      })
    )
      return true;

    // check if email exists
    if (
      await prisma.user.findFirst({
        where: {
          email: email,
        },
      })
    )
      return true;

    return false;
  } catch (err) {
    throw new Error("Error checking if user exits\n" + err);
  }
};

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

/**
 * Logs out by setting a dummy value to the jwt
 *
 * @param req
 * @param res
 * @returns {void}
 */
export const logOut = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    res.cookie("jwt", "logged out", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: false,
    });

    return resGenerator(res, 200, "success", "logged out");
  } catch (err) {
    next(err);
  }
};

/**
 * Protect the current route to only allow the logged in user to access it
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return resGenerator(res, 400, "fail", "You are not logged in");
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
      return resGenerator(res, 400, "fail", "Invalid token");
    }

    const userId: number = decoded.userId;

    const user: User | null = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return resGenerator(res, 400, "fail", "No logged in user");
    }

    authenticateRequest(user);

    next();
  } catch (err) {
    next(err);
  }
};
