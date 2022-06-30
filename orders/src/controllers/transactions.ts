import { Response, Request, NextFunction } from "express";
import { cartModel } from "../models/cart";
import { transactionModel } from "../models/transactions";
import MpesaImp from "./mpesa";

const getTrans = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let query = {
			cartId: req.body.cart_id,
			_id: req.body.transaction_id,
		};
		query = JSON.parse(JSON.stringify(query));
		const data = await transactionModel.find(query);
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};
const payMpesa = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.body.user._id;
	const cart_id = req.body.cart._id;
	const phone_number = req.body.phoneNumber;
	const amount = await cartModel.calculatePrice(cart_id);
	if (amount) {
		const mpesa = new MpesaImp();
		mpesa.pay(amount, phone_number, cart_id);
	}
};
const mpesaCallBack = async () => {
	/**
	 * Proccess to push notification
	 */
};

const payCash = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.body.user._id;
	const cart_id = req.body.cart._id;
	let mode = "CASH";
	let amount = await cartModel.calculatePrice(cart_id);
	const data = {
		user,
		cartId: cart_id,
		mode,
		amount,
		complete: false,
		recieptId: "String",
	};
	const dataModel = await transactionModel.create(data);
	await dataModel.save();
};
const payPayPal = async (req: Request, res: Response, next: NextFunction) => {};

export { payCash, payMpesa, payPayPal, getTrans, mpesaCallBack };
