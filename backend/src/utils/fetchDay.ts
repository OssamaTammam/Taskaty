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
    const formattedDate = date.toISOString().split("T")[0];

    // Fetch the day if it exists
    let day: Day | null = await prisma.day.findFirst({
      where: {
        userId: loggedInUser.id,
        AND: {
          createdAt: {
            gte: new Date(`${formattedDate}T00:00:00Z`),
            lt: new Date(`${formattedDate}T23:59:59.999Z`),
          },
        },
      },
      include: {
        todos: true,
        journals: true,
      },
    });

    // Create the day if it doesn't exist
    if (!day) {
      day = await prisma.day.create({
        data: {
          createdAt: new Date(), // Ensure a new createdAt value is set
          userId: loggedInUser.id,
        },
      });
    }

    return day;
  } catch (err) {
    throw new Error("Error fetching day\n" + err);
  }
};
