import { Request, Response, NextFunction } from "express";
import { TodoModel } from "../api/todo/todo.model";

export const checkTodoExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId: string = req.params.id;
    const todo = await TodoModel.findById(todoId);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    next();
  } catch (err) {
    next(err);
  }
};
