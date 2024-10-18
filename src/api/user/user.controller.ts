import { Request, NextFunction, Response, response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import userService from "./user.service";
import { NotFoundError } from "../../errors/not-found";
import { use } from "passport";

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

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    await userService.requestPasswordReset(username);
    res.status(200).json({ message: 'Controlla la tua email per le istruzioni di reset della password.' });
  } catch (error) {
    next(error);
  }
};

export const validateResetToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, userId } = req.query;
    const isValid = await userService.validatePasswordResetToken(token as string, userId as string);
    if (!isValid) {
      console.log("Token: ", token, "UserId: ", userId);
      return res.status(400).json({ message: 'Token non valido o scaduto.' });
    }
    res.status(200).json({ message: 'Token valido.' });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordFromEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token, newPassword } = req.body;
    await userService.resetPasswordFromToken(userId, token, newPassword);
    res.status(200).json({ message: 'Password reimpostata con successo.' });
  } catch (error) {
    next(error);
  }
};