import express from "express";
import { addAddr, delAddr, patchAddr, getAddr } from "../controllers/address";
import { auth_req } from "../middleware/auth";
const router = express.Router();

router.post("/add", addAddr);
router.get("/:userId", auth_req, getAddr);
router.patch("/:userId/:addrId", auth_req, patchAddr);
router.delete("/:userId/:addrId", auth_req, delAddr);

export { router as AddrRouter };
