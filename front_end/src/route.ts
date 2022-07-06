import { randomUUID } from "crypto";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.render("index");
});
router.get("/index", (req: Request, res: Response) => {
	res.render("index");
});
router.get("/home", (req: Request, res: Response) => {
	res.render("index");
});
router.get("/login", (req: Request, res: Response) => {
	res.render("login");
});
router.get("/registration", (req: Request, res: Response) => {
	res.render("registration");
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
	res.render("product-details");
});

export { router as getRoutes };
