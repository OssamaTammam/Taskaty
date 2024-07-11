import { Response } from "express";
import { Jwt, sign, verify } from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

/**
 * Sign JWT and return it
 *
 * @param userId
 * @returns signed JWT
 */
const signJWT = async (userId: number): Promise<string> =>
  await sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * create JWT and store it in a cookie and return the token
 *
 * @param userId
 * @param res
 * @returns JWT
 */
export const createJWT = async (
  userId: number,
  res: Response,
): Promise<string> => {
  const token: string = await signJWT(userId);
  const cookieExpirationDuration: string =
    process.env.JWT_COOKIE_EXPIRES_IN || "30";
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(cookieExpirationDuration, 10) * 24 * 60 * 60 * 1000,
    ),
    secure: false, //HTTPS only
    httpOnly: false, //Makes cookie not accessible by js
    sameSite: "None",
  };

  (res as any).cookie("jwt", token, cookieOptions);
  return token;
};

/**
 * Verify token
 *
 * @param token
 * @returns {JwtPayload} Payload containing id decoded using secret
 */
export const verifyJWT = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "") as JwtPayload;
    return decoded;
  } catch (err) {
    console.error("Error verifying token\n", err);
    return null;
  }
};
