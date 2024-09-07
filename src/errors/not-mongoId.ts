import { Request, Response, NextFunction } from "express";

export class NotMongoIdError extends Error {
  constructor() {
    super("Validation error");
  }
}

export const notMongoIdHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotMongoIdError) {
    res.status(400);
    res.json({
      error: "Validation error",
      message: "Not valid MongoId",
    });
  } else {
    next(err);
  }
};
