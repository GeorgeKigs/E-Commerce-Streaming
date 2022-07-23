import { Request, Response, NextFunction } from "express";
import { cartModel, cartInt } from "../models/cart";

interface Prod {
	user: cartInt["user"];
	products: cartInt["products"];
}

const getCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.body.user._id;
		const data = await cartModel
			.findOne({ user })
			.select("-createdAt -updatedAt -orderNumber");
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};
const createCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = {
			user: req.body.user._id,
			products: [] as any[],
		};
		const products = req.body.products as any[];
		if (!products) {
			res.status(401).json({
				success: false,
				message: "The cart has to have a product",
			});
		}
		for (const key in products) {
			const element = products[key];
			let id = element["product"];
			const product = await (await fetch(`{PROD_URL}/${id}`)).json();
			if (product) element["price "] = product.price;
		}
		data["products"] = [...products];

		var carts = await cartModel.findOne({ user: data["user"] });
		if (carts) {
			await cartModel.findOneAndDelete({ user: data["user"] });
		}

		var cart = await cartModel.create(data);
		await cart.save();
		res.status(200).send({
			success: true,
			data: cart,
		});
	} catch (error) {
		next(error);
	}
};
const addProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let data = {
			user: req.body.user._id,
			products: [
				{
					product: req.body.product_id,
					quantity: req.body.quantity,
				},
			],
		};
		let cart_data = await cartModel.addProduct(data);
		res.status(200).json({
			success: true,
			data: cart_data,
		});
	} catch (error) {
		next(error);
	}
};
const removeProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let data = {
			user: req.body.user._id,
			products: [
				{
					product: req.body.product_id,
				},
			],
		};
		let cart_data = await cartModel.removeProduct(data);
		res.status(200).json({
			success: true,
			data: cart_data,
		});
	} catch (error) {
		next(error);
	}
};
const setProdQuantity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const prod_data = {
			user: req.body.user._id,

			product: req.body.product_id,
			quantity: req.body.quantity,
		};
		const data = await cartModel.setProdQuantity(prod_data);
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.body.user._id;
		const data = cartModel.findOneAndDelete({ user });
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};

export {
	createCart,
	addProduct,
	removeProduct,
	setProdQuantity,
	deleteCart,
	getCart,
};
