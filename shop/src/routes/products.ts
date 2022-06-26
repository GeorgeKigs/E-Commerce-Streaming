import express from "express";
import {
	add_product,
	del_product,
	change_price,
	change_quan,
	getProduct,
	filterProducts,
} from "../controllers/products";
import { auth_req } from "../middleware/auth";

var router = express.Router();

router.get("/productId/:product_id", getProduct);
router.get("/filterProducts", filterProducts);

//handle photo uploads

router.post("/add", auth_req, add_product);
router.post("/delPhoto");

router.post("/delProduct", auth_req, del_product);
router.post("/changePrice", auth_req, change_price);
router.post("/changeQuantity", auth_req, change_quan);

export { router as productsRouter };
