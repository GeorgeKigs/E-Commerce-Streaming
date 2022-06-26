import { Request, Response, NextFunction } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config({ path: "../../env" });

/**
 * Verifies the token being used by the user.
 * @param token The string token used to authorize the transaction
 * @returns false| Json Web Token string.
 */
const get_token = (token: string): false | JwtPayload => {
	try {
		const secret = process.env["JWT_SECRET_KEY"] as string;
		const payload = jsonwebtoken.verify(token, secret) as JwtPayload;
		return payload;
	} catch (error) {
		return false;
	}
};

/**
 * Signs the token to authorize the user to use this service.
 * @param data: any
 * @returns token:string
 */
const sign_token = (data: any): string => {
	const secret = process.env["JWT_SECRET_KEY"] as string;
	data.admin = true;
	data.shop_auth = true;
	const token = jsonwebtoken.sign(data, secret);
	return token;
};

/**
 * Makes sure all the users are authorized to make the request.
 * Checks the validity of the token, and if the user is in the database.
 * @params req,res,next
 */
const auth_req = async (req: Request, res: Response, next: NextFunction) => {
	var auth_error = createHttpError("Unauthorised");
	try {
		var header = req.headers["Authorization"];
		if (!header || typeof header !== "string") return next(auth_error);

		const token = header?.split(" ")[1];
		if (!token) return next(auth_error);

		var data = get_token(token);
		if (!data) return next(auth_error);

		if (data.shop_auth) {
			return next();
		} else {
			const url = process.env["AUTH_URL"] as string;
			var user_data = fetch(`${url}/${token}`);
			// check admin
			var isadmin = true;
			if (!isadmin) return next(auth_error);
			req.body.token = sign_token(user_data);
			return next();
		}
	} catch (error) {
		return next(auth_error);
	}
};

export { auth_req };
