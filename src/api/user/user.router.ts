import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import { getUserById, me } from "./user.controller";
import { showAllUsers } from "./user.controller";
import { findUserByFullName } from "./user.controller";
//import { add_friend } from "./user.controller";

const router = express.Router();

router.use(isAuthenticated);
router.get("/me", me);
router.get("/users", showAllUsers);
router.get("/user/:fullName", findUserByFullName);
router.get("/:id", getUserById);

export default router;
