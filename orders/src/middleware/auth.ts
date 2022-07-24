import { Request, Response, NextFunction } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { config } from "../configs/configs";

/**
 * Verifies the token being used by the user.
 * @param token The string token used to authorize the transaction
 * @returns false| Json Web Token string.
 */
const get_token = (token: string): false | JwtPayload => {
	try {
		const secret = config.jwt_secret as string;
		const payload = jsonwebtoken.verify(token, secret) as JwtPayload;

		return payload;
	} catch (error) {
		console.log(error);
		return false;
	}
};

/**
 * Signs the token to authorize the user to use this service.
 * @param data: any
 * @returns token:string
 */
const sign_token = (data: any): string => {
	const secret = config.jwt_secret as string;
	data.data.order_auth = true;
	// console.log(data);
	const token = jsonwebtoken.sign(data.data, secret);
	return token;
};

/**
 * Makes sure all the users are authorized to make the request.
 * Checks the validity of the token, and if the user is in the database.
 * @params req,res,next
 */

const admin_auth_req = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const url = process.env["ADMIN_URL"];
		const token = req.body.token;
		const url_data = req.body.user;
		if (url_data.admin) {
			return next();
		} else {
			return next(Error("unauthorized"));
		}
	} catch (error) {
		return next(error);
	}
};
const auth_req = async (req: Request, res: Response, next: NextFunction) => {
	var auth_error = createHttpError("Unauthorised");
	try {
		var header = req.headers["authorization"];

		if (!header || typeof header !== "string") {
			console.log(header);
			return next(auth_error);
		}

		const token = header?.split(" ")[1];

		if (!token) return next(auth_error);

		var data = get_token(token);
		// console.log("data", data);
		if (!data) return next(auth_error);

		if (data.order_auth) {
			req.body.user = data;
			return next();
		} else {
			const url = config.auth_url as string;
			var user_data = await (await fetch(`${url}/${token}`)).json();
			req.body.user = user_data;
			req.body.token = sign_token(user_data);
			return next();
		}
	} catch (error) {
		// console.log(error);
		return next(auth_error);
	}
};

export { auth_req, admin_auth_req };
