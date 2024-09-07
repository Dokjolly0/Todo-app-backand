import { Request, Response, NextFunction } from "express";

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
      super(message);
      this.name = "UnauthorizedError";
    }
}

export const notFoundHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof UnauthorizedError) {
      res.status(404);
      res.json({
        error: "UnauthorizedError",
        message: "User not autorized",
      });
    } else {
      next(err);
    }
};