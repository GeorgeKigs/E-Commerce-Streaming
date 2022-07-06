import express from "express";
import { addr_router } from "./address";
import { auth_not_req, auth_req } from "../middleware/auth";
import {
	login,
	registration,
	update_pass,
	update_user,
	forgot_pass,
	logout,
	del_user,
	getUser,
	validateUser,
} from "../controllers/users";

let router = express.Router();

/* GET users listing. */
router.get("/userId/:userid", getUser);
router.get("/validateUser/:token", validateUser);

router.use("/address", addr_router);
router.post("/register", auth_not_req, registration);
router.post("/forgotPassword", auth_not_req, forgot_pass);
router.post("/login", auth_not_req, login);
router.post("/updateUser", auth_req, update_user);
router.post("/changePassword", auth_req, update_pass);
router.post("/logout", auth_req, logout);
router.post("/delUser", auth_req, del_user);

export { router as usersRouter };
