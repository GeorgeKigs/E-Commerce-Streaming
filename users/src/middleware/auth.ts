import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { returnInt, userModel } from "../models/users";
import { verifyToken } from "../models/misc";
import createHttpError from "http-errors";

async function checkUser(data: any): Promise<boolean> {
	var email: string = data.email;
	var check = await userModel.findByEmail(email);
	return typeof check == null;
}

const auth_req = async (req: Request, res: Response, next: NextFunction) => {
	try {
		var header = req.headers["authorization"];
		if (!header) {
			return next("Unauthorised");
		}
		// var host = req.headers["from"];
		const token = header?.split(" ")[1];

		const data = await verifyToken(token);
		if (!data) {
			return next("Unauthorised");
		}
		var check = await checkUser(data);
		if (!check) {
			return next("Unauthorised");
		}
		req.body["token"] = token;
		return next();
	} catch (error) {
		return next(error);
	}
};
const auth_not_req = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	/**
	 * Middleware to make sure all the users are authorized and authenticated.
	 */
	try {
		var header = req.headers["authorization"];
		if (!header) {
			return next();
		}
		// var host = req.headers["from"];
		const token = header?.split(" ")[1];

		const data = await verifyToken(token);
		if (!data) {
			return next();
		}
		var check = await checkUser(data);
		if (!check) {
			return next();
		}
		return next(createHttpError("Unauthorised"));
	} catch (error) {
		return next(
			createHttpError("error while handling the authentication not required.")
		);
	}
};

export { auth_req, auth_not_req };
