import { productModel } from "../models/products";
import { Request, Response, NextFunction } from "express";
import categoryModel from "../models/categories";
import createHttpError from "http-errors";

const gen_metadata = async (query: any) => {
	console.log(
		`This might be changed due the reccomendation system. But it uses aggregation of the products`
	);
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var id = req.params.product_id;

		const product = await productModel.findById(id).populate("category");
		console.log(product);
		if (!product) {
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
		console.log(error);
		next(createHttpError("could not fetch product"));
	}
};

const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// include pagination
		let name = req.query.searchTerm;
		let page = req.query.page as string;
		let limit = req.query.limit as string;
		let int_page = 1;
		let int_limit = 10;

		let count = await productModel
			.find({
				productName: req.query.name
					? { $regex: `*${name}*`, $options: "i" }
					: undefined,
			})
			.count();

		if (page) {
			int_page = parseInt(page);
		}
		if (limit) {
			int_limit = parseInt(limit);
		}

		let product_data = await productModel
			.find({
				productName: req.query.name
					? { $regex: `*${name}*`, $options: "i" }
					: undefined,
			})
			.skip((int_page - 1) * int_limit)
			.limit(int_limit);

		res.status(200).json({
			succes: true,
			metadata: { count, pages: Math.ceil(count / int_limit) },
			data: product_data,
		});
	} catch (error) {
		next(Error(`could not search the products due to ${error}`));
	}
};

async function filterProducts(req: Request, res: Response, next: NextFunction) {
	try {
		console.log(req.query);
		let params = {
			category: req.query.categoryId
				? req.query.categoryId.toString().toLowerCase()
				: undefined,
			price: {
				$gte: req.query.low || req.query.price || 0,
				$lte: req.query.high || req.query.price,
			},
			"tag.tagName": req.query.tagName
				? req.query.tagName.toString().toLowerCase()
				: undefined,
			quantity: {
				$lte: req.query.quantity,
				$gte: req.query.quantity || 1,
			},
		};
		let page = req.query.page as string;
		let limit = req.query.limit as string;
		let int_page = 1;
		let int_limit = 10;

		if (page) {
			int_page = parseInt(page);
		}
		if (limit) {
			int_limit = parseInt(limit);
		}
		params = JSON.parse(JSON.stringify(params));
		console.log(params);

		let count = await productModel.find({ ...params }).count();

		let data = {} as any;
		if (params) {
			data = await productModel
				.find({ ...params })
				.select("-discount")
				.limit(int_limit)
				.skip((int_page - 1) * int_limit);
		} else {
			data = await productModel
				.find({})
				.limit(int_limit)
				.skip((int_page - 1) * int_limit);
		}
		console.log(data);
		res.status(200).json({
			success: true,
			metadata: { count, pages: Math.ceil(count / int_limit) },
			data,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
}

const findByCart = async (req: Request, res: Response, next: NextFunction) => {
	let params = req.params.categoryName;
	try {
		if (params) {
			let data = await productModel.findByCategory(params);
			res.status(200).json({
				success: true,
				data,
			});
		} else {
			res.status(400).json({
				success: false,
				message: "data is missing",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: `find By Category has this error ${error}`,
		});
	}
};

const add_product = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let product = {
			productName: req.body.productName,
			category: req.body.categoryName,
			description: req.body.description,
			discount: req.body.discount,
			price: req.body.price,
			quantity: req.body.quantity,
			productPic: [] as any[],
		};
		req.body.productPic.forEach((element: string) => {
			product.productPic.push({ location: element });
		});
		console.log(product.category);
		const id = await categoryModel.findOne(
			{
				categoryName: product.category,
			},
			{ _id: 1 }
		);

		product["category"] = id?._id;
		console.log(product);
		const products = await productModel.create(product);

		res.json({ success: true, return: products });
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
	findByCart,
	search,
};
