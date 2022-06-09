import { userModel } from "../models/users";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../models/misc";

const registration = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// check for valid token

		var user = new userModel(req.body);
		await user.save();
		var token = generateToken(user);
		res.status(200).json({ message: "success in the registration", token });
	} catch (error) {
		next(error);
	}
};
const logout = async (req: Request, res: Response, next: NextFunction) => {};
const login = async (req: Request, res: Response, next: NextFunction) => {
	// check for valid token
	const body = req.body();
	var email: string = body.email;
	var password: string = body.password;
	var valid = await userModel.authenticate(email, password);
	// check if they have deleted their account
	if (valid) {
		var data = await userModel.findByEmail(email);
		if (data) {
			var token = generateToken(data);
			res.status(200).json({
				message: "success",
				token: token,
			});
		}
	}
	res.status(401).json({
		message: "error",
	});
};
const forgot_pass = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};
const del_user = async (req: Request, res: Response, next: NextFunction) => {
	var email: string = req.body.email;
	var deleted = await userModel.deleteUser(email);
	if (deleted) {
		res.redirect("/logout");
	}
	res.status(403).json({
		message: "Not Authorised",
	});
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
			message: "success",
		});
	}
	res.status(403).json({
		message: "error",
	});
};
const update_pass = async (req: Request, res: Response, next: NextFunction) => {
	var password: string = req.body.password;
	var c_password: string = req.body.c_password;
	var email: string = req.body.email;
	if (password === c_password) {
		var changed = await userModel.updatePassword(email, password);
		if (changed) {
			res.status(200).json({
				message: "success",
			});
		}
	}

	res.status(403).json({
		message: "error",
	});
};

export {
	registration,
	login,
	update_user,
	forgot_pass,
	update_pass,
	logout,
	del_user,
};
