import { Day } from "@prisma/client";
import { Response, Request, NextFunction } from "express";
import prisma from "../utils/prismaClient";
import resGenerator from "../utils/resGenerator";
import { fetchDay } from "../utils/fetchDay";

/**
 * Retrieves a day based on the provided date.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A response indicating the success or failure of the operation.
 */
export const getDay = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // In case of protect middleware failure this is for safety
    if (!req.loggedInUser) {
      return resGenerator(res, 400, "fail", "No logged in user");
    }

    const desiredDate: Date = new Date(Date.parse(req.body.date));
    const day: Day = await fetchDay(req.loggedInUser, desiredDate);

    return resGenerator(
      res,
      201,
      "success",
      `Day with id ${day.id} fetched successfully`,
      day,
    );
  } catch (err) {
    next(new Error("Failed fetching day\n" + err));
  }
};

/**
 * Deletes a day from the database.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A response indicating the success or failure of the operation.
 */
export const deleteDay = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // In case of protect middleware failure this is for safety
    if (!req.loggedInUser) {
      return resGenerator(res, 400, "fail", "No logged in user");
    }

    const desiredDate: Date = new Date(Date.parse(req.body.date));
    const day: Day = await fetchDay(req.loggedInUser, desiredDate);

    console.log(day);

    await prisma.day.delete({
      where: {
        id: day.id,
      },
    });

    return resGenerator(
      res,
      200,
      "success",
      `Day with id ${day.id} deleted successfully`,
      day,
    );
  } catch (err) {
    next(new Error("Failed fetching day\n" + err));
  }
};
