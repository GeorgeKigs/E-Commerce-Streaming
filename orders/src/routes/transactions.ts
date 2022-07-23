import express from "express";
import {
	getTrans,
	mpesaCallBack,
	payCash,
	payMpesa,
	payPayPal,
} from "../controllers/transactions";
import { admin_auth_req } from "../middleware/auth";

const router = express.Router();

router.get("/transaction", getTrans);
router.post("/mpesa/callback", mpesaCallBack);
router.post("/mpesa", payMpesa);
router.post("/cash", payCash);

export { router as transRouter };
