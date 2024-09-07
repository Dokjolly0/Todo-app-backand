import { Request, Response, NextFunction } from "express";

export class BadRequestError extends Error {
  constructor() {
    super("Bad request");
  }
}

export const badRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BadRequestError) {
    res.status(400);
    res.json({
      error: "BadRequestError",
      message: "Bad request error"
    });
  } else {
    next(err);
  }
};
