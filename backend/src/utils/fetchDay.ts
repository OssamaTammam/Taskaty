import prisma from "./prismaClient";
import { Day, User } from "@prisma/client";

/**
 * Fetches day or creates it depending if the user logged anything of that day to the DB
 *
 * @param loggedInUser
 * @param date
 * @returns
 */
export const fetchDay = async (
  loggedInUser: User,
  date: Date,
): Promise<Day> => {
  try {
    // Fetch the day if it exists
    let day: Day | null = await prisma.day.findFirst({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });

    // Create the day if it doesn't exist
    if (!day) {
      day = await prisma.day.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
        },
      });
    }

    return day;
  } catch (err) {
    throw new Error("Error fetching day\n" + err);
  }
};
