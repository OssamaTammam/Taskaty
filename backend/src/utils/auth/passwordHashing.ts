import { hash, verify } from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword: string = await hash(password);
    return hashedPassword;
  } catch (err) {
    throw new Error("Error hashing password\n" + err);
  }
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await verify(hashedPassword, plainPassword);
  } catch (err) {
    throw new Error("Error verifying password\n" + err);
  }
};
