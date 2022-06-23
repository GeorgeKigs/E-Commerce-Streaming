import { NextFunction, Request, Response } from "express";
import { generateToken } from "../models/misc";
import createHttpError from "http-errors";
import { userModel, returnInt } from "../models/users";

const login = async (req: Request, res: Response, next: NextFunction) => {
	const identifier = req.body.email;
	const password = req.body.password;

	// const authenticated = await userModel.authenticate(identifier, password);
	const authenticated = false;
	if (authenticated) {
		var data = await userModel.findByEmail(identifier);

		const token = generateToken(data);

		res.status(200).json({
			success: true,
			token: token,
			uuid: data?.get("customerNumber"),
			message: "login was successful",
		});
	} else {
		res.status(403).json({
			success: false,
			message: "Unauthorised",
		});
	}
};
const registration = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const data: any = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			customerNumber: req.body.uuid,
			password: req.body.password,
		};
		// data["ip"] = req.ip;
		var user = new userModel(data);
		await user.save();

		delete data["password"];
		var token = generateToken(data);
		console.log(data);

		res.status(200).json({
			success: true,
			uuid: data["customerNumber"],
			token,
			message: "registration was successful",
		});
	} catch (error) {
		next(createHttpError("cannot register the customer"));
	}
};
const update_pass = async (req: Request, res: Response, next: NextFunction) => {
	var password: string = req.body.password;
	var c_password: string = req.body.c_password;
	var email: string = req.body.email;
	if (password === c_password) {
		var changed = await userModel.updatePassword(email, password);
		if (changed) {
			res.status(200).json({
				success: true,
				message: "success",
			});
		}
	} else {
		res.status(403).json({
			success: false,
			message: "error",
		});
	}
};
const update_user = async (req: Request, res: Response, next: NextFunction) => {
	var email: string = req.body.email;
	var data = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	};
	var details = await userModel.findOneAndUpdate({ email }, data);
	if (details) {
		res.status(200).json({
			success: true,
			message: "success",
		});
	}
	res.status(403).json({
		message: "error",
	});
};
const forgot_pass = async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "forgot password was successful",
	});
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
	//add a field from last login for the customers

	res.status(200).json({
		success: true,
		token: null,
		message: "logout was successful",
	});
};
const del_user = async (req: Request, res: Response, next: NextFunction) => {
	var identifier = req.body.email;
	var deleted = await userModel.deleteUser(identifier);
	if (deleted) {
		res.status(200).json({
			success: true,
			message: "deleting user was successful",
		});
	} else {
		res.status(403).json({
			success: false,
			message: "deleting user was not successful",
		});
	}
};

export {
	login,
	registration,
	update_pass,
	update_user,
	forgot_pass,
	logout,
	del_user,
};
