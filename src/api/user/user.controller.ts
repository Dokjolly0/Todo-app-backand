import { Request, NextFunction, Response, response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import userService from "./user.service";
import { NotFoundError } from "../../errors/not-found";

export const me = async (req: TypedRequest, res: Response, next: NextFunction) => {
  res.json(req.user!);
};

export const showAllUsers = async (req: TypedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const users = await userService.showAllUsers(user.id!);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const findUserByFullName = async (req: TypedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const fullName: string = req.params.fullName as string; // Assicurati che fullName sia di tipo stringa
    const spaceIndex = fullName.indexOf(" ");
    const firstName = spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
    const lastName = spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : "";

    const users = await userService.findUserByFullName(user.id!, firstName, lastName);
    if (!users) throw new NotFoundError();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: TypedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const userToFind: string = req.params.id;
    const result = await userService.getUserById(user.id!, userToFind);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { newPassword } = req.body;
    const result = await userService.resetPassword(user.id!, newPassword);
    res.json({ message: "Password updated" });
  } catch(err) {
    next(err);
  }
}

export const validatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const oldPassword = req.params.oldPassword;
    const result = await userService.validatePassword(user.id!, oldPassword);
    res.json({ message: result ? "Password is valid" : "Password is invalid" });
  } catch (err) {
    console.error(err); // Log the error
    next(err); // Forward error to the error-handling middleware
  }
};