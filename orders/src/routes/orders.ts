import express from "express";
import { change_status, get_order } from "../controllers/orders";
import { admin_auth_req, auth_req } from "../middleware/auth";

var router = express.Router();

router.get("/", auth_req, admin_auth_req, get_order);
router.post("/changeStatus", auth_req, admin_auth_req, change_status);

export { router as ordersRouter };
