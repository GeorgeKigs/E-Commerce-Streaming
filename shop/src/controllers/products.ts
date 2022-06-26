import { productModel } from "../models/products";
import { Request, Response, NextFunction } from "express";
import categoryModel from "../models/categories";
import createHttpError from "http-errors";

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var id = req.params.product_id;
		const product = await productModel.findById(id);
		if (product?.quantity == 0 || !product) {
			res.status(200).json({
				success: true,
				data: null,
			});
		} else {
			res.status(200).json({
				success: true,
				data: product,
			});
		}
	} catch (error) {
		next(createHttpError("could not fetch product"));
	}
};

const filterProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let params = {
			productName: req.query.name
				? { $regex: `*${req.query.name}*`, $options: "i" }
				: undefined,
			category: req.query.categoryName
				? { $regex: `*${req.query.categoryName}*`, $options: "i" }
				: undefined,
			price: {
				$gte: req.query.low || req.query.price || 0,
				$lte: req.query.high || req.query.price,
			},
			"tag.tagName": req.query.tagName
				? { $regex: `*${req.query.tagName}*`, $options: "i" }
				: undefined,
			quantity: {
				$lte: req.query.quantity,
				$gte: req.query.quantity || 1,
			},
		};
		params = JSON.parse(JSON.stringify(params));
		const data = productModel.find({ ...params }).select("-discount");
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};

const add_product = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let product = req.body;
		const id = await categoryModel.findOne(
			{
				categoryName: product.productLine,
			},
			{ _id: 1 }
		);

		product["category"] = id?._id;

		const products = new productModel(product);
		await products.save();

		res.json({ success: true, return: 0 });
	} catch (error) {
		next(error);
	}
};
const del_product = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.body.id;
		const data = await productModel.findByIdAndDelete(id);
		res.status(200).json({
			success: true,
			message: `${data?.productName} has been deleted`,
		});
	} catch (error) {
		next(error);
	}
};

const change_price = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.body.id;
		const new_price = req.body.price as number;
		const data = await productModel.findByIdAndUpdate(
			id,
			{
				$set: { price: new_price },
			},
			{ new: true }
		);
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};
const change_quan = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.body.id;
		const quantity = req.body.quantity;
		const data = await productModel.findByIdAndUpdate(
			id,
			{
				$set: { quantity: quantity },
			},
			{ new: true }
		);
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};

export {
	add_product,
	del_product,
	change_price,
	change_quan,
	getProduct,
	filterProducts,
};
