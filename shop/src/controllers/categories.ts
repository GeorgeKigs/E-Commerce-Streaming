import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import catergoryModel from "../models/categories";

const getCartegory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const data = await catergoryModel
			.find({ "deleted.status": false })
			.select("-deleted")
			.limit(10);
		res.status(100).json({
			success: true,
			data: data,
		});
	} catch (error) {
		next(createHttpError("Could not get Categories"));
	}
};
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

const remove_cat = async (req: Request, res: Response, next: NextFunction) => {
	var categoryName = req.body.categoryName;
	var deleted = catergoryModel.deleteCategory(categoryName);
	res.status(200).json({
		success: deleted,
	});
};
// this is the textual content of the categories in place
const edit_cat = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.body.category_id;
	const data = {};
};

export { add_cat, remove_cat, edit_cat, getCartegory };
