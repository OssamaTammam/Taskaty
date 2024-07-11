import { Router } from "express";
import { protectRoute } from "../controller/authController";
import { addTodo, deleteTodo, updateTodo } from "../controller/todoController";

const todoRouter = Router();

// Auth required
todoRouter.use(protectRoute);
todoRouter.route("").post(addTodo).delete(deleteTodo).put(updateTodo);

export default todoRouter;
