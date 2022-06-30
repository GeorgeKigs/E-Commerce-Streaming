import { Response, Request, NextFunction } from "express";
import { orderModel } from "../models/orders";

const get_order = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const order = req.body.order_id;
		const data = await orderModel.findById(order);
		res.status(200).json({
			success: true,
			address: data?.address,
			data,
		});
	} catch (error) {
		next(error);
	}
};
const change_status = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.body.cart_id;
	const status = req.body.status;
	const data = await orderModel.findByIdAndUpdate(id, { status });
	res.status(200).json({
		success: true,
		data,
	});
};

export { get_order, change_status };
