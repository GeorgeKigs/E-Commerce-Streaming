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
categoriesRouter.post("/addCategory", auth_req, add_cat);
categoriesRouter.post("/delCategory", auth_req, remove_cat);
categoriesRouter.post("/editCategory", auth_req, edit_cat);

export { categoriesRouter };
