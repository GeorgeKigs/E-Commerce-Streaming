import { randomUUID } from "crypto";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.render("index");
});
router.get("/login", (req: Request, res: Response) => {
	res.render("login");
});
router.get("/registration", (req: Request, res: Response) => {
	res.render("sign up");
});
router.get("/checkout", (req: Request, res: Response) => {
	res.render("checkout");
});
router.get("/cart", (req: Request, res: Response) => {
	res.render("cart");
});
router.get("/shop", (req: Request, res: Response) => {
	res.render("shop");
});
router.get("/getUUID", (req: Request, res: Response) => {
	var id = randomUUID();
	res.json({
		uuid: id,
	});
});
router.get("/product-details", (req: Request, res: Response) => {
	res.render("shop");
});

export { router as getRoutes };
