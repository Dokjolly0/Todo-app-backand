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

    const existingUser = await UserModel.findOne({
      firstName: user.firstName,
      lastName: user.lastName,
    });
    if (existingUser) throw new Error("Esiste già un utente con lo stesso username.");

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
}
export default new UserService();
