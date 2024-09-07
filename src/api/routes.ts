import express from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import todo_router from "./todo/todo.router";

const router = express.Router();

router.use("/todos", todo_router);
router.use("/users", userRouter);
router.use("/", authRouter);

export default router;
