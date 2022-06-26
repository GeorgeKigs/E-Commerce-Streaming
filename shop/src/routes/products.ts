import express, { Request, Response, NextFunction } from "express";
import {
	add_product,
	del_product,
	change_price,
	change_quan,
} from "../controllers/products";
import { auth_req } from "../middleware/auth";

var router = express.Router();

router.get("/", function (req: Request, res: Response, next: NextFunction) {
	res.send("respond with a resource");
});

router.post("/add", auth_req, add_product);
router.post("/delProduct", auth_req, del_product);
router.post("/changePrice", auth_req, change_price);
router.post("/changeQuantity", auth_req, change_quan);

export { router as productsRouter };
