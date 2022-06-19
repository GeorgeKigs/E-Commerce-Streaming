import express, { Request, Response, NextFunction } from "express";

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

export { router as getRoutes };
