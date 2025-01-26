import express from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import todo_router from "./todo/todo.router";
import { TodoModel } from "./todo/todo.model";
import { UserModel } from "./user/user.model";
import { UserIdentityModel } from "../utils/auth/local/user-identity.model";

const router = express.Router();

router.use("/todos", todo_router);
router.use("/users", userRouter);
router.use("/", authRouter);

//DEV delete all collection on db
router.delete("/deleteall", async (req, res) => {
  try {
    await UserModel.deleteMany({});
    await TodoModel.deleteMany({});
    await UserIdentityModel.deleteMany({});
    res.send("All collection deleted");
  } catch (error: any) {
    res.status(500).json({ "Error deleting all collection on db: ": error.message });
  }
});

export default router;
