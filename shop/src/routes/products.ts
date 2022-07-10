import express from "express";
import {
	add_product,
	del_product,
	change_price,
	change_quan,
	getProduct,
	filterProducts,
	findByCart,
} from "../controllers/products";
import { auth_req } from "../middleware/auth";

var router = express.Router();

router.get("/productId/:product_id", getProduct);
router.get("/filterProducts", filterProducts);
router.get("/findByCategory", findByCart);
//handle photo uploads

router.post("/addProduct", add_product);
router.post("/delPhoto");

router.post("/delProduct", del_product);
router.post("/changePrice", change_price);
router.post("/changeQuantity", change_quan);

export { router as productsRouter };
