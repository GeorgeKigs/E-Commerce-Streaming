import addrModel from "../models/address";
import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/users";
import mongoose from "mongoose";

const addAddr = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var email = req.body.data.email;
		console.log(req.body.data);
		const address = {
			street: req.body.street,
			zipcode: req.body.zipcode,
			city: req.body.city,
			phoneNumber: req.body.phone_number,
		};
		var user = await userModel.findByEmail(email);
		var addr = await addrModel.findOneAndUpdate(
			{ user: user?._id },
			{ $push: { address: address, $sort: { date: 1 } } },
			{
				new: true,
				sort: { "address.date": 1 },
				upsert: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(200).json({
			success: true,
			message: "Address was added",
			addr,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Could not add data",
		});
	}
};

const patchAddr = async (req: Request, res: Response, next: NextFunction) => {};

const delAddr = async (req: Request, res: Response, next: NextFunction) => {
	var addr_id = req.body.user_id;
	// await addrModel.findByIdAndUpdate(addr_id,{$pull:{address:}})
	res.status(200).json({
		success: true,
		message: "deleted the address",
	});
};

const getAddr = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var user_id = new mongoose.Types.ObjectId(req.body.data._id);
		var data = await addrModel.findOne({ user: user_id });
		data?.address.reverse();
		console.log(data);
		res.status(200).json({
			success: true,
			data,
		});
	} catch (error) {
		next(error);
	}
};

export { addAddr, patchAddr, delAddr, getAddr };
