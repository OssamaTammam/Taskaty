import { Request, Response, NextFunction, response } from "express";
import { TodoData } from "../model/todoModel";
import resGenerator from "../utils/resGenerator";
import { Day, Priority, Todo } from "@prisma/client";
import prisma from "../utils/prismaClient";
import { fetchDay } from "../utils/fetchDay";

/**
 * Creates a new Todo entry in the database
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const addTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // In case of protect middleware failure this is for safety
    if (!req.loggedInUser) {
      return resGenerator(res, 400, "fail", "No logged in user");
    }

    // Decide type of priority
    let priority: Priority | null;
    switch (req.body.priority) {
      case "low":
        priority = Priority.LOW;
        break;
      case "medium":
        priority = Priority.MEDIUM;
        break;
      case "high":
        priority = Priority.HIGH;
        break;
      default:
        priority = null;
        break;
    }

    if (!priority) {
      return resGenerator(
        res,
        400,
        "fail",
        `Priority Value cannot be ${priority}`,
      );
    }

    const currDate: Date = new Date();
    const day: Day = await fetchDay(
      req.loggedInUser,
      req.body.date ? new Date(req.body.date) : currDate,
    );

    const todoData: TodoData = {
      title: req.body.title,
      description: req.body.description,
      priority: priority,
      day: { connect: { id: day.id } },
    };

    const todoEntry: Todo = await prisma.todo.create({
      data: todoData,
    });

    return resGenerator(
      res,
      201,
      "success",
      `Todo entry created successfully for ${req.loggedInUser.username}`,
      todoEntry,
    );
  } catch (err) {
    next(
      new Error("Error adding Todo entry to current logged in user\n" + err),
    );
  }
};

/**
 * Deletes Todo entry from the DB
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.todo.delete({
      where: {
        id: parseInt(req.body.id, 10),
      },
    });

    return resGenerator(
      res,
      200,
      "success",
      `Todo entry with id ${req.body.id} deleted successfully`,
    );
  } catch (err) {
    next(
      new Error("Error deleting Todo entry to current logged in user\n" + err),
    );
  }
};

/**
 * Updates Todo entry
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, priority, completed, completedAt, dayId } =
      req.body;

    // Prepare update data
    const updateData: Partial<TodoData> = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (priority) {
      switch (priority) {
        case "low":
          updateData.priority = Priority.LOW;
          break;
        case "medium":
          updateData.priority = Priority.MEDIUM;
          break;
        case "high":
          updateData.priority = Priority.HIGH;
          break;
        default:
          return resGenerator(res, 400, "fail", "Invalid priority value");
      }
    }

    if (dayId) {
      const day: Day | null = await prisma.day.findFirst({
        where: { id: dayId },
      });

      if (!day) {
        return resGenerator(res, 400, "fail", "Day not found");
      }
      updateData.day = { connect: { id: day.id } };
    }

    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed && completedAt) {
        updateData.completedAt = completedAt;
      }
    }

    const updatedTodoEntry: Todo = await prisma.todo.update({
      where: {
        id: parseInt(req.body.id, 10),
      },
      data: updateData,
    });

    return resGenerator(
      res,
      200,
      "success",
      `Todo entry with id ${req.body.id} updated successfully`,
      updatedTodoEntry,
    );
  } catch (err) {
    next(new Error("Error updating Todo entry\n" + err));
  }
};
