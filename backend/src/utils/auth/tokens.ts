import { sign } from "jsonwebtoken";

const signJWT = async (userId: number) =>
  await sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const createJWT = async (userId: number, res: Response) => {
  const token = await signJWT(userId);
  const cookieExpirationDuration = process.env.JWT_COOKIE_EXPIRES_IN || "30";
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
