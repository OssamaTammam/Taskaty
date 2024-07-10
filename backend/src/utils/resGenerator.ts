import { Response } from "express";

/**
 * Takes all the response inputs and returns a JSON response to the client
 *
 * @param res
 * @param statusCode
 * @param status
 * @param message
 */
const resGenerator = (
  res: Response,
  statusCode: number,
  status: string,
  message: string,
): void => {
  try {
    res.status(statusCode).json({
      status,
      message,
    });
  } catch (err) {
    throw new Error("Couldn't send response\n" + err);
  }
};

export default resGenerator;
