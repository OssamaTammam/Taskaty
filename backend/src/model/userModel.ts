import { User } from "@prisma/client";
import prisma from "../utils/prismaClient";

/**
 * Interface to specify a type of the user data used during signing up process
 */
export interface UserData {
  username: string;
  password: string;
  email: string;
}

/**
 *  Helper function to check if the password is of length 8, has one symbol, one capital letter and one number at least
 *
 * @param password
 * @returns boolean if the password is valid
 */
const isPasswordValid = (password: string): boolean => {
  // Regex pattern to validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])(?=.*[0-9]).{8,}$/;

  return passwordRegex.test(password);
};

/**
 * Check if the email entered is a valid email
 *
 * @param email
 * @returns boolean if the email is valid
 */
export const checkEmailSpecification = (email: string): boolean => {
  // Regex pattern to validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * Checks if the name of length 4 and the password is on the right format
 *
 * @param username
 * @param password
 * @returns boolean if the entered data is using the right formats
 */
export const checkUsernamePasswordSpecification = (
  username: string,
  password: string,
): boolean => {
  if (username.length < 4) return false;
  if (!isPasswordValid(password)) return false;

  return true;
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
