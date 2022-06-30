import express from "express";
import {
	getTrans,
	mpesaCallBack,
	payCash,
	payMpesa,
	payPayPal,
} from "../controllers/transactions";
import { admin_auth_req, auth_req } from "../middleware/auth";

const router = express.Router();

router.get("/transaction", auth_req, admin_auth_req, getTrans);
router.post("/mpesa/callback", mpesaCallBack);
router.post("/mpesa", auth_req, payMpesa);
router.post("/cash", auth_req, payCash);
router.post("/paypal", auth_req, payPayPal);

export { router as transRouter };
