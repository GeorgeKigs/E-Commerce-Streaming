import addrModel from "../models/address";
import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/users";

const createAddr = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var email = req.body.email;
		var user = await userModel.findByEmail(email);
		if (user) {
			var data = {
				user: user._id,
				address: {
					street: req.body.street,
					zipcode: req.body.zipcode,
					city: req.body.city,
				},
			};
			await addrModel.create(data);
			res.status(200).json({
				success: true,
				message: "Address was added",
			});
		} else {
			res.status(403).json({
				success: false,
				message: "user does not exist",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Could not add data",
		});
	}
};

const addAddr = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var email = req.body.email;
		const address = {
			street: req.body.street,
			zipcode: req.body.zipcode,
			city: req.body.city,
		};
		var user = await userModel.findByEmail(email);
		var addr = await addrModel.findOneAndUpdate(
			{ user: user?._id },
			{ $push: { address: address, $sort: { date: 1 } } }
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
	var user_id = req.body._id;
};

export { addAddr, patchAddr, delAddr, getAddr, createAddr };
