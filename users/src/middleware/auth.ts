/**
 * TODO: Add refresher tokens to improve the authorization procedure
 *
 */

import { Request, Response, NextFunction } from "express";
import { returnInt, userModel } from "../models/users";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import { verifyToken } from "../models/misc";

import { kafka_client } from "../utils";

dotenv.config({ path: "../../env" });

async function checkUser(data: any): Promise<boolean> {
	var email: string = data.email;
	var check = await userModel.findByEmail(email);
	return typeof check == null;
}

const getData = async (token: string): Promise<boolean | any> => {
	const data: any = await verifyToken(token);
	if (!data) {
		return false;
	}
	var check = await checkUser(data);
	if (!check) {
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
		var header = req.headers["Authorization"];
		if (!header) {
			return next("Unauthorised");
		}
		// var host = req.headers["from"];
		var token = "";
		if (typeof header == "string") {
			token = header?.split(" ")[1];
		} else {
			return next("token is unauthorized");
		}
		const data = await getData(token);
		if (data) {
			req.body.user_id = data._id;
		}
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
	 * Middleware to make sure all the users are not yet authorized.
	 */
	try {
		var header = req.headers["Authorization"];
		if (!header || header != "") {
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

export { auth_req, auth_not_req, getData };
