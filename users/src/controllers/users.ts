import { NextFunction, Request, Response } from "express";
import { generateToken } from "../models/misc";
import createHttpError from "http-errors";
import { userModel } from "../models/users";
import { getData } from "../middleware/auth";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var userId = req.params.userid as string;
		const user = userModel
			.findById(userId)
			.select("firstName lastName email phoneNumber registered customerNumber");
		res.status(200).json({
			succcess: true,
			data: user,
		});
	} catch (error) {
		next(createHttpError("Request is invalid"));
	}
};

const validateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		var token = req.params.token as string;
		const result = await getData(token);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(createHttpError("request is invalid"));
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const identifier = req.body.email;
		const password = req.body.password;

		const authenticated = await userModel.authenticate(identifier, password);
		if (authenticated) {
			var data = await userModel.findByEmail(identifier);

			data = {
				_id: data?.id,
				customerNumber: data?.customerNumber,
				firstName: data?.firstName,
				lastName: data?.lastName,
				email: data?.email,
				phoneNumber: data?.phoneNumber,
			};
			console.log("login page we were here");
			console.log(data);

			const token = generateToken(data);

			res.status(200).json({
				success: true,
				token: token,
				uuid: data["customerNumber"],
				message: "login was successful",
			});
		} else {
			next(Error("Unauthorized"));
		}
	} catch (error) {
		next(error);
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
			phoneNumber: req.body.phoneNumber,
			password: req.body.password,
		};
		console.log(data);
		// data["ip"] = req.ip;

		var user = new userModel(data);
		await user.save();

		delete data["password"];
		data["_id"] = user.id;

		var token = generateToken(data);
		console.log(data);

		res.status(200).json({
			success: true,
			uuid: data["customerNumber"],
			token,
			message: "registration was successful",
		});
	} catch (error) {
		console.log(error);
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
		success: false,
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
	validateUser,
	getUser,
};
