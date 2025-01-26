import { NotFoundError } from "../../errors/not-found";
import { UnauthorizedError } from "../../errors/UnoutorizedError";
import { UserExistsError } from "../../errors/user-exists";
import { UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { emailService } from "../../utils/email.service";
import { getHtmlRequestChangePassword } from "../../utils/get_html_content";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  async add(user: User, credentials: { username: string; password: string }): Promise<User> {
    const existingIdentity = await UserIdentityModel.findOne({
      "credentials.username": credentials.username,
    });
    if (existingIdentity) throw new UserExistsError();

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const confirmationCode = uuidv4();
    const newUser = await UserModel.create({
      ...user,
      isActive: false,
      confirmationCode,
    });
    await UserIdentityModel.create({
      provider: "local",
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });
    return newUser;
  }

  async showAllUsers(userId: string): Promise<User[]> {
    const isAuthenticated = await UserModel.findById(userId);
    if (!isAuthenticated) throw new UnauthorizedError();
    const users = await UserModel.find();
    return users;
  }

  async findUserByFullName(userId: string, firstName: string, lastName: string) {
    const isAuthenticated = await UserModel.findById(userId);
    if (!isAuthenticated) throw new UnauthorizedError();
    const user = await UserModel.findOne({ firstName, lastName });
    if (!user) new NotFoundError();
    return user;
  }

  async getUserById(userId: string, userIdToFind: string) {
    const isAuthenticated = await UserModel.findById(userId);
    if (!isAuthenticated) throw new UnauthorizedError();
    const user = await UserModel.findById(userIdToFind);
    if (!user) throw new NotFoundError();
    return user;
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) throw new UnauthorizedError();
    const identity = await UserIdentityModel.findOne({ user: userId, provider: "local" });
    if (!identity) throw new NotFoundError();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    identity.credentials.hashedPassword = hashedPassword;
    await identity.save();
  }

  async validatePassword(userId: string, oldPassword: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (!user) new UnauthorizedError();
    const identity = await UserIdentityModel.findOne({ user: userId, provider: "local" });
    if (!identity) throw new NotFoundError();
    const passwordMatch = await bcrypt.compare(oldPassword, identity.credentials.hashedPassword);
    return passwordMatch;
  }

  async verifyConfirmationCode(userId: string, confirmationCode: string) {
    const user = await UserModel.findById(userId);
    if (user && user.confirmationCode === confirmationCode) {
      user.isActive = true;
      user.confirmationCode = undefined;
      await user.save();
      return true;
    }
    return false;
  }

  async requestPasswordReset(username: string): Promise<void> {
    const user = await UserIdentityModel.findOne({
      "credentials.username": username,
    });
    if (!user) throw new NotFoundError();

    const token = uuidv4(); // Genera un token univoco
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 ora

    // Salva il token e la scadenza nel database
    user.resetPasswordToken = token;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    const htmlContent = getHtmlRequestChangePassword(token, user.id);
    await emailService.sendEmail(username, "Reimposta la tua password", htmlContent);
  }

  async validatePasswordResetToken(token: string, userId: string): Promise<boolean> {
    const user = await UserIdentityModel.findById(userId);
    if (!user) return false;
    const isTokenValid = user.resetPasswordToken === token; // Controllo del token
    const isNotExpired = user.resetPasswordExpires !== null && user.resetPasswordExpires! > new Date();
    // Restituisce true solo se il token è valido e non è scaduto
    return isTokenValid && isNotExpired;
  }

  async resetPasswordFromToken(userId: string, token: string, newPassword: string): Promise<void> {
    const user = await UserIdentityModel.findById(userId);
    if (!user || user.resetPasswordExpires! < new Date()) throw new UnauthorizedError();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await UserIdentityModel.updateOne(
      { user: userId, provider: "local" },
      { "credentials.hashedPassword": hashedPassword }
    );
    await user.save();
  }
}
export default new UserService();
