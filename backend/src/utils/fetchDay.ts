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
    const formattedDate: string = date.toISOString().split("T")[0];

    // Fetch the day if it exists
    let day: Day | null = await prisma.day.findFirst({
      where: {
        userId: loggedInUser.id,
        date: formattedDate,
      },
      include: {
        todos: true,
        journals: true,
      },
    });

    // If day doesn't exist, create a new one
    if (!day) {
      day = await prisma.day.create({
        data: {
          date: formattedDate, // Set the exact date and time for createdAt
          userId: loggedInUser.id,
        },
        include: {
          todos: true,
          journals: true,
        },
      });
    }

    return day;
  } catch (err) {
    throw new Error("Error fetching day\n" + err);
  }
};
