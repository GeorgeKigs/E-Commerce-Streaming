/**
 * TODO: Add refresher tokens to improve the authorization procedure
 *
 */

import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/users";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import { verifyToken } from "../models/misc";

dotenv.config({ path: "../../env" });

async function checkUser(data: any): Promise<boolean> {
	var email: string = data.email;
	var check = await userModel.findByEmail(email);
	console.log(check);
	return typeof check == null;
}

const getData = async (token: string): Promise<boolean | any> => {
	const data: any = await verifyToken(token);
	console.log(data);
	if (!data) {
		return false;
	}
	var check = await checkUser(data);
	console.log(check);
	if (check) {
		return false;
	}
	return data;
};

const auth_req = async (req: Request, res: Response, next: NextFunction) => {
	/**
	 *
	 * Makes sure all the users are authorizrd to make the request
	 */
	try {
		var header = req.headers["authorization"];
		if (!header) {
			return next("Unauthorised");
		}
		console.log(header);
		// var host = req.headers["from"];
		var token = "";
		if (typeof header == "string") {
			token = header?.split(" ")[1];
		} else {
			return next("token is unauthorized");
		}
		console.log(token);
		const data = await getData(token);
		console.log(data);
		if (data) {
			console.log(data);
			req.body.data = data;
			req.body.user_id = data._id;
		}
		return next();
	} catch (error) {
		console.log(error);
		return next(Error("Check the headers"));
	}
};
const auth_not_req = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	/**
	 * Middleware to make sure all the users are not yet authorized.
	 */
	try {
		var header = req.headers["authorization"];
		if (!header || header === "") {
			console.log("headers do not exist");
			return next();
		}
		// var host = req.headers["from"];

		const token = header?.split(" ")[1];

		const data = await verifyToken(token);
		if (!data) {
			return next();
		}

		var check = await checkUser(data);
		console.log(check);
		if (check) {
			return next();
		}

		return next(createHttpError("Unauthorised"));
	} catch (error) {
		let message = error as any;
		if (message.message == "jwt expired") {
			return next();
		} else {
			return next(
				createHttpError("error while handling the authentication not required.")
			);
		}
	}
};

export { auth_req, auth_not_req, getData };
