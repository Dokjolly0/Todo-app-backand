import TodoService from "./todo.service";
import { Request, Response, NextFunction } from "express";
import { AddTodoDto, CheckTodoDto } from "./todo.dto";
import { TypedRequest } from "../../utils/typed-request";
import { UserModel } from "../user/user.model";
import { BadRequestError } from "../../errors/bad-request";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    let showCompleted =
      !!req.query.showCompleted && (req.query.showCompleted as string).toLowerCase() === "true"; // Prende il valore di showCompleted nella query, se è true la variabile torna true, se no false
    let todos = await TodoService.showTodo(user.id!, showCompleted);
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

export const add = async (req: TypedRequest<AddTodoDto>, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    if (req.body.assignedTo !== undefined) {
      const isAssign = await UserModel.findById(req.body.assignedTo);
      if (isAssign === null) throw new BadRequestError();
    }
    // Create a new todo
    const newTodo = await TodoService.addTodo(req.body, user.id!);
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const check = async (req: TypedRequest<any, any, CheckTodoDto>, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const todoId: string = req.params.id;
    const todo = await TodoService.checkTodo(user.id, todoId, true);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const uncheck = async (
  req: TypedRequest<any, any, CheckTodoDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const todoId = req.params.id;
    const todo = await TodoService.checkTodo(user.id, todoId, false);
    res.status(200).json(todo);
  } catch (err: any) {
    next(err);
  }
};

export const assign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { assignedTo } = req.body;
    const todoId = req.params.id;
    const todo = await TodoService.assignTodo(todoId, assignedTo, user.id!);
    await todo!.save();
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const getByTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const title = req.params.title as string;
    const todo = await TodoService.getByTitle(title, user.id!);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const delate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const id = req.params.id as string;
    const todo = await TodoService.deleteTodo(id, user.id!);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const todoData = req.body;
    await TodoService.updateTodo(user.id!, todoData);
    res.status(200).json({ message: "Todo aggiornato" });
  } catch (err) {
    next(err);
  }
};
