import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import {
  add,
  list,
  check,
  uncheck,
  assign,
  getByTitle,
  getById,
  delate,
  updateDate,
} from "./todo.controller";
import { validate } from "../../utils/validation-middleware";
import { AddTodoDto } from "./todo.dto";

const router = express.Router();

router.use(isAuthenticated);
router.get("/", list);
router.post("/", validate(AddTodoDto), add);
router.patch("/:id/check", check);
router.patch("/:id/uncheck", uncheck);
router.post("/:id/assign", assign);
/* Chiamate in più */
router.get("/title/:title", getByTitle);
router.get("/id/:id", getById);
router.delete("/delete/:id", delate);
router.patch("/:id/date", updateDate);

export default router;

//router.post("/:id/assign", /*canAssing,*/validate(CheckTodoDto), assign);
//Controlla se l'utente ha accesso al todo
//Check e Uncheck possono essere fatti sia da chi li ha creati, sia da chi sono assegnati

// function canAssing(req: Request, res: Response, next: NextFunction) {
//   const todoId = req.params.id;
//   const userId = req.user?.id;
//   // fai il controllo
//   if (userCanAssign) {
//     next();
//   } else {
//     next(new NotFoundError());
//   }
// }
