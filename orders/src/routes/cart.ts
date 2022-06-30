import express from "express";
import {
	createCart,
	addProduct,
	removeProduct,
	setProdQuantity,
	deleteCart,
	getCart,
} from "../controllers/cart";
import { auth_req } from "../middleware/auth";

var router = express.Router();

router.get("/", auth_req, getCart);

router.post("/add", auth_req, createCart);
router.post("/addProduct", auth_req, addProduct);
router.post("/removeProduct", auth_req, removeProduct);
router.post("/addQuan", auth_req, setProdQuantity);
router.post("/delCart", auth_req, deleteCart);

export { router as cartRouter };
