import { Request, Response, NextFunction } from "express";

export class UtenteNonTrovatoError extends Error {
  constructor(message?: string) {
    super(message || "Utente non trovato");
    this.name = "UtenteNonTrovatoError";
  }
}

export const notFoundHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof UtenteNonTrovatoError) {
    res.status(404);
    res.json({
      error: "NotFoundError",
      message: "User not found",
    });
  } else {
    next(err);
  }
};
