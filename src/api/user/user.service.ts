import { NotFoundError } from "../../errors/not-found";
import { UnauthorizedError } from "../../errors/UnoutorizedError";
import { UserExistsError } from "../../errors/user-exists";
import { UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from "bcrypt";

export class UserService {
  async add(user: User, credentials: { username: string; password: string }): Promise<User> {
    const existingIdentity = await UserIdentityModel.findOne({
      "credentials.username": credentials.username,
    });
    if (existingIdentity) throw new UserExistsError();

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const newUser = await UserModel.create(user);
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
}
export default new UserService();
