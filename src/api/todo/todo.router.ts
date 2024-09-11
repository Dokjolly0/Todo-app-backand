import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import { add, list, check, uncheck, assign, getByTitle, delate, updateTodo } from "./todo.controller";
import { validate } from "../../utils/validation-middleware";
import { AddTodoDto } from "./todo.dto";

const router = express.Router();

router.use(isAuthenticated);
router.get("/", list);
router.post("/", validate(AddTodoDto), add);
router.patch("/:id/check", check);
router.patch("/:id/uncheck", uncheck);
router.post("/:id/assign", assign);
/* Nuove aggiunte*/
router.patch("/update", updateTodo);
router.delete("/delete/:id", delate);
router.get("/title/:title", getByTitle);

export default router;
