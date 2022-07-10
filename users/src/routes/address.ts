import express from "express";
import { addAddr, patchAddr, delAddr, getAddr } from "../controllers/address";
import { auth_req } from "../middleware/auth";
const router = express.Router();

router.get("/", auth_req, getAddr);
router.post("/addAddress", auth_req, addAddr);
router.post("/deleteAddress", auth_req, delAddr);
router.post("/patchAddress", auth_req, patchAddr);

export { router as addr_router };
