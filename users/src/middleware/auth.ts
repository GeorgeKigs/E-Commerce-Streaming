import { Request, Response, NextFunction } from "express";
import { returnInt, userModel } from "../models/users";
import { verifyToken } from "../models/misc";
import createHttpError from "http-errors";
import { kafka } from "../utils";

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

const produce = async (topic: string, partition: number, message: string) => {};

const consume = async () => {
	const consumer = kafka.consumer({
		allowAutoTopicCreation: false,
		groupId: "basic_authorization",
	});

	await consumer.connect();
	await consumer.subscribe({
		topic: "basic_auth_topic",
		fromBeginning: true,
	});
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log({
				key: message.key?.toString(),
				value: message.value?.toString(),
			});
		},
	});
};

export { auth_req, auth_not_req };
