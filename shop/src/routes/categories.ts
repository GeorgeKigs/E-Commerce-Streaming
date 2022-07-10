import express from "express";
import {
	add_cat,
	remove_cat,
	edit_cat,
	getCartegory,
} from "../controllers/categories";
import { auth_req } from "../middleware/auth";

const categoriesRouter: express.IRouter = express.Router();

/* GET users listing. */
categoriesRouter.get("/", getCartegory);
categoriesRouter.post("/addCategory", add_cat);
categoriesRouter.post("/delCategory", remove_cat);
categoriesRouter.post("/editCategory", edit_cat);

export { categoriesRouter };
