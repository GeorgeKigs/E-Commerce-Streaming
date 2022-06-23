import express from "express";
import {
	addAddr,
	patchAddr,
	delAddr,
	getAddr,
	createAddr,
} from "../controllers/address";
const router = express.Router();

router.get("/", getAddr);
router.post("/addAddress", addAddr);
router.post("/deleteAddress", delAddr);
router.post("/patchAddress",patchAddr)
router.post("/createAddress",createAddr)

export { router as addr_router };
