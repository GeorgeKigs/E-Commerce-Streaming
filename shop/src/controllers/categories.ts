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
		res.status(200).json({
			success: true,
			data: data,
		});
	} catch (error) {
		next(createHttpError("Could not get Categories"));
	}
};
const add_cat = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let pics = [] as any[];
		req.body.pics.forEach((element: string) => {
			pics.push({ location: element });
		});
		let category = {
			categoryName: req.body.categoryName,
			description: req.body.description,
			categoryPics: pics,
		};
		console.log(category);

		let data = await catergoryModel.create(category);

		res.json({ success: true, return: data });
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
