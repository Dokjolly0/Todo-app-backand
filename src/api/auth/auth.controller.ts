import { NextFunction, Response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import userService from "../user/user.service";
import { AddUserDTO } from "./auth.dto";
import { omit, pick } from "lodash";
import { UserExistsError } from "../../errors/user-exists";
import passport, { use } from "passport";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/auth/jwt/jwt-strategy";
import { emailService } from "../../utils/email.service";
import { getHtmlAddMessage } from "../../utils/get_html_content";

export const login = async (req: TypedRequest, res: Response, next: NextFunction) => {
  try {
    const authMiddleware = passport.authenticate("local", (err, user, info) => {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        res.status(401);
        res.json({
          error: "LoginError",
          message: info.message,
        });
        return;
      }
      if (!user.isActive) {
        res.status(400).json({
          error: "LoginError",
          message:
            "Account non attivato. Controlla la tua casella mail per confermare la registrazione.",
        });
        return;
      }
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7 days" });
      res.status(200);
      res.json({
        user,
        token,
      });
    });
    authMiddleware(req, res, next);
  } catch (e) {
    next(e);
  }
};

export const add = async (req: TypedRequest<AddUserDTO>, res: Response, next: NextFunction) => {
  try {
    // Take data
    const userData = omit(req.body, "username", "password");
    const updatedUserData = {
      ...userData,
      openDate: new Date(),
      isActive: false,
      resetPasswordToken: null, 
      resetPasswordExpires: null,
    };
    const credentials = pick(req.body, "username", "password");
    // Create user
    const newUser = await userService.add(updatedUserData, credentials);
    // Send email
    const htmlContent = getHtmlAddMessage(newUser.id!, newUser.confirmationCode);
    await emailService.sendEmail(req.body.username, "Conferma email", htmlContent)
    // Return
    res.status(201).json({
      message:
        "Utente registrato correttamente. Controlla la tua casella mail per confermare la registrazione.",
      userId: newUser.id,
    });
  } catch (e: any) {
    if (e instanceof UserExistsError) {
      res.status(400);
      res.send(e.message);
    } else {
      res.status(500).json({
        "Internal Server Error": "The server encountered an internal error" + e.message,
      });
    }
  }
};

export const confirmEmail = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, code } = req.query;

    const isConfirmed = await userService.verifyConfirmationCode(
      userId as string,
      code as string
    );

    if (isConfirmed) {
      res.redirect(
        "https://alexviolatto.com/confirm-email"
      );
      // res.status(200).json({ message: 'Mail confermata, account attivato.' });
    } else {
      res.redirect(
        "https://alexviolatto.com/confirm-email-failed"
      );
        // res.status(400).json({ message: "Codice di conferma non valido." });
    }
  } catch (error) {
    next(error);
  }
};