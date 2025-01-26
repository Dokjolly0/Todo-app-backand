import express from "express";
import { validate } from "../../utils/validation-middleware";
import { AddUserDTO, LoginDTO } from "./auth.dto";
import { add, confirmEmail, login } from "./auth.controller";
import { requestPasswordReset, resetPasswordFromEmail, validateResetToken } from "../user/user.controller";

const router = express.Router();

router.post("/login", validate(LoginDTO), login);
router.post("/register", validate(AddUserDTO), add);
router.get("/confirm-email", confirmEmail);
router.post("/request-password-reset", requestPasswordReset); // Richiede reset password
router.get("/validate-reset-token", validateResetToken); // Valida il token ricevuto via mail
router.post("/reset-password-with-email", resetPasswordFromEmail); // Reimposta la password

export default router;
