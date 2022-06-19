import express, { Request, Response, NextFunction } from "express";
import catergoryModel from "../models/categories";
import { add_cat, remove_cat, edit_cat } from "../controllers/categories";

const categoriesRouter: express.IRouter = express.Router();

/* GET users listing. */
categoriesRouter.get(
	"/",
	function (req: Request, res: Response, next: NextFunction) {
		res.send("respond with a resource");
	}
);
app.use("/", indexRouter);
// app.use("/users", usersRouter);

// app.use("/products", productsRouter);
// app.use("/orders", ordersRouter);
// app.use("/cart", cartRouter);
// app.use("/categories", categoriesRouter);

categoriesRouter.post("/addCategory", add_cat);
categoriesRouter.post("/delCategory", remove_cat);
categoriesRouter.post("/editCategory", edit_cat);

export { categoriesRouter };
