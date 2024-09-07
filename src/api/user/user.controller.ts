import { NextFunction, Response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import userService from "./user.service";
import { NotFoundError } from "../../errors/not-found";

export const me = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user!);
};

export const showAllUsers = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const users = await userService.showAllUsers(user.id!);
    res.json(users);
  } catch (err) {
    next(err)
  }
};

export const findUserByFullName = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const fullName: string = req.params.fullName as string; // Assicurati che fullName sia di tipo stringa
    const spaceIndex = fullName.indexOf(" ");
    const firstName =
      spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
    const lastName =
      spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : "";

    const users = await userService.findUserByFullName(
      user.id!,
      firstName,
      lastName
    );

    if (!users) throw new NotFoundError();
    res.json(users);
  } catch (err) {
    next(err)
  }
};

// export const add_friend = async (
//   req: TypedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = req.user;
//     if (!user) throw new Error("Utente non trovato");
//     const friendId: string = req.query.friendId as string;
//     const result = await userService.addFriend(user!, friendId);
//     res.json({ message: "Amico aggiunto con successo", friendId: result });
//   } catch (err: any) {
//     if (err.message === "Utente non trovato")
//       res.status(404).json({ message: "Utente non trovato" });
//     //
//     else if (err.message === "Utente da aggiungere non trovato")
//       res.status(404).json({ message: "Utente da aggiungere non trovato" });
//     //
//     else
//       res
//         .status(500)
//         .json({ message: "Errore interno del server: " + err.message });
//   }
// };
