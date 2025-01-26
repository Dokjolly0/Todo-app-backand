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
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

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
          message: "Account non attivato. Controlla la tua casella mail per confermare la registrazione.",
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
    console.log("Credentials: ", credentials);

    // Gestiamo l'immagine base64, se presente
    if (req.body.picture) {
      //const base64Data = req.body.picture.split(";base64,").pop(); // Rimuoviamo il
      const base64Data = req.body.picture.split(";base64,").pop();
      //prefisso 'data:image/png;base64,'
      console.log("Base64 data length:", base64Data?.length);

      if (base64Data) {
        const imageName = `${uuidv4()}.png`; // Generiamo un nome unico per l'immagine
        const imagePath = path.join(__dirname, "../../image/user-img", imageName); // Percorso completo dell'immagine
        console.log("Image path:", imagePath);

        // Scriviamo il file in disco
        fs.writeFile(imagePath, base64Data, { encoding: "base64" }, (err) => {
          if (err) {
            console.error("Error saving image:", err);
            return res.status(500).json({ error: "Error saving image: " + err.message });
          }
          console.log("Image saved successfully");
        });
        console.log("Image name:", imageName);

        // Aggiungiamo il percorso dell'immagine nel dato utente
        updatedUserData.picture = `/image/user-img/${imageName}`;
      }
    }

    // Create user
    const newUser = await userService.add(updatedUserData, credentials);

    // Send email
    const htmlContent = getHtmlAddMessage(newUser.id!, newUser.confirmationCode);
    await emailService.sendEmail(req.body.username, "Conferma email", htmlContent);

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
        "Internal Server Error": "The server encountered an internal error: " + e.message,
      });
    }
  }
};

export const confirmEmail = async (req: TypedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, code } = req.query;

    const isConfirmed = await userService.verifyConfirmationCode(userId as string, code as string);
    console.log("Success: " + isConfirmed);

    if (isConfirmed) {
      //res.redirect(process.env.API_URL + "/confirm-email-success");
      res.status(200).json({ message: "Mail confermata, account attivato." });
    } else {
      //res.redirect(process.env.API_URL + "/confirm-email-failure");
      res.status(400).json({ message: "Codice di conferma non valido." });
    }
  } catch (error) {
    next(error);
  }
};
