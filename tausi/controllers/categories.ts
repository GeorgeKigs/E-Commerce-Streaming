import { Request, Response, NextFunction } from "express";
import catergoryModel from "../models/categories";

const add_cat = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let category = req.body;
		// console.log(category)
		let data = new catergoryModel(category);
		// let data = new
		await data.save();

		res.json({ success: true, return: 0 });
	} catch (error) {
		next(error);
	}
};

const remove_cat = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};
const edit_cat = async (req: Request, res: Response, next: NextFunction) => {};

export { add_cat, remove_cat, edit_cat };
