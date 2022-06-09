import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/users";
import { verifyToken } from "../models/misc";

const auth_req = async (req: Request, res: Response, next: NextFunction) => {
	/**
	 * Middleware to make sure all the users are authorized and authenticated.
	 */
	try {
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
		return next();
	} catch (error) {
		return next(error);
	}
};

export { auth_req, auth_not_req };
