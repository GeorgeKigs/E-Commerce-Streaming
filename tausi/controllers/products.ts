import { productModel } from "../models/products";
import { Request, Response, NextFunction } from "express";
import categoryModel from "../models/categories";

const add_product = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let product = req.body;

		const id = await categoryModel.findOne(
			{
				categoryName: product.productLine,
			},
			{ _id: 1 }
		);

		console.log(id);

		product["category"] = id?._id;

		const products = new productModel(product);
		await products.save();

		res.json({ success: true, return: 0 });
	} catch (error) {
		next(error);
	}
};
const del_product = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};

const change_price = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};
const change_quan = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};

export { add_product, del_product, change_price, change_quan };
