import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import { me } from "./user.controller";
import { showAllUsers } from "./user.controller";
import { findUserByFullName } from "./user.controller";
//import { add_friend } from "./user.controller";

const router = express.Router();

router.get("/me", isAuthenticated, me);
router.get("/users", isAuthenticated, showAllUsers);
router.get("/user/:fullName", isAuthenticated, findUserByFullName);
//router.post("/user/:friendId", isAuthenticated, add_friend);

export default router;
