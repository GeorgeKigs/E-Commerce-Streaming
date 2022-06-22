import { NextFunction, Request, Response } from "express";
import { generateToken } from "../models/misc";
import { userModel, returnInt } from "../models/users";

const login = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const token = generateToken(data);
	res.status(200).json({
		success: 200,
		token: token,
		message: "login was successful",
	});
};
const registration = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const data = req.body;
	data.ip = req.ip;
	console.log(data);

	res.status(200).json({
		success: 200,
		message: "registration was successful",
	});
};
const update_pass = async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: 200,
		message: "update password was successful",
	});
};
const update_user = async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: 200,
		message: "update user was successful",
	});
};
const forgot_pass = async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: 200,
		message: "forgot password was successful",
	});
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: 200,
		message: "logout was successful",
	});
};
const del_user = async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: 200,
		message: "deleting user was successful",
	});
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
