import { Day, Journal } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { fetchDay } from "../utils/fetchDay";
import resGenerator from "../utils/resGenerator";
import { JournalData } from "../model/journalModel";
import prisma from "../utils/prismaClient";

/**
 * Create new Journal entry for current logged in user in the DB
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const addJournal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // In case of protect middleware failure this is for safety
    if (!req.loggedInUser) {
      return resGenerator(res, 400, "fail", "No logged in user");
    }

    const currDate: Date = new Date();
    const day: Day = await fetchDay(req.loggedInUser, currDate);

    const journalData: JournalData = {
      content: req.body.content,
      day: { connect: { id: day.id } },
    };

    const journalEntry: Journal = await prisma.journal.create({
      data: journalData,
    });

    return resGenerator(
      res,
      201,
      "success",
      `Journal entry created successfully for ${req.loggedInUser.username}`,
      journalEntry,
    );
  } catch (err) {
    next(
      new Error("Error adding Journal entry to current logged in user\n" + err),
    );
  }
};

/**
 * Deletes Journal entry from the DB
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const deleteJournal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.journal.delete({
      where: {
        id: parseInt(req.body.id, 10),
      },
    });

    return resGenerator(
      res,
      200,
      "success",
      `Journal entry with id ${req.body.id} deleted successfully`,
    );
  } catch (err) {
    next(
      new Error(
        "Error deleting Journal entry to current logged in user\n" + err,
      ),
    );
  }
};

/**
 * Updates Journal entry
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateJournal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const day: Day | null = await prisma.day.findFirst({
      where: {
        id: req.body.dayId,
      },
    });

    if (!day) {
      return resGenerator(res, 400, "fail", "Day not found");
    }

    const journalData: JournalData = {
      content: req.body.content,
      day: { connect: { id: day.id } },
    };

    const updatedJournalEntry: Journal = await prisma.journal.update({
      where: {
        id: parseInt(req.body.id, 10),
      },
      data: journalData,
    });

    return resGenerator(
      res,
      200,
      "success",
      `Journal entry with id ${req.body.id} updated successfully`,
      updatedJournalEntry,
    );
  } catch (err) {
    next(
      new Error(
        "Error updating Journal entry to current logged in user\n" + err,
      ),
    );
  }
};
