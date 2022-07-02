/**
Schema for the new users registered within the organisation */

import { Schema, model, Model, Types, Document } from "mongoose";
import { hashPassword, sendCodeMail, comparePassword } from "./misc";

interface returnInt extends Document {
	_id: Types.ObjectId;
	customerNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: number;
}
interface userInt extends returnInt {
	_id: Types.ObjectId;
	password: string;
	registered: {
		status: boolean;
		when: Date;
	};
	deleted: {
		status: boolean;
		when: Date;
	};
}
interface staticsInt extends Model<userInt> {
	findByEmail(email: string): Promise<Document<returnInt> | null>;
	findByPhoneNumber(phoneNumber: number): Promise<Document<returnInt> | null>;
	deleteUser(identifier: string | number): Promise<boolean>;
	updatePassword(email: string, password: string): Promise<boolean>;
	authenticate(identifier: string | number, password: string): Promise<boolean>;
}

const user = new Schema<userInt, staticsInt>(
	{
		customerNumber: {
			type: String,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		phoneNumber: {
			type: Number,
		},
		registered: {
			status: {
				type: Boolean,
				default: false,
			},
			when: {
				type: Date,
				default: Date.now,
			},
		},
		deleted: {
			status: {
				type: Boolean,
				default: false,
			},
			when: {
				type: Date,
				default: Date.now,
			},
		},
	},
	{
		collection: "user",
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

let createError = (message: string): Error => {
	return new Error(message);
};

user.pre("save", async function (next) {
	var user = await userModel.findOne({
		$or: [
			{
				email: this.email,
			},
			{
				phoneNumber: this.phoneNumber,
			},
		],
	});

	if (user) {
		next(createError("The user already exists"));
	}
	if (this.password.length < 8) {
		next(createError("password.length < 8"));
	}
	var hash = await hashPassword(this.password);

	this.password = hash;
	this.registered.status = false;
	this.deleted.status = false;

	next();
});

user.pre("findOneAndUpdate", async function (next) {
	//check if there is a password to prevent it from being updated
	//@ts-ignore
	if (this._update.password || this._update.email) {
		next(createError("Cannot update such personal details"));
	}

	next();
});

const { statics, methods } = user;

user.static(
	"updatePassword",
	async function updatePassword(
		email: string,
		password: string
	): Promise<boolean> {
		var hash = await hashPassword(password);
		const user = userModel.findOneAndUpdate(
			{
				email,
			},
			{
				$set: {
					password: hash,
				},
			}
		);
		if (!user) {
			return false;
		}
		return true;
	}
);

// soft delete for the users
statics.deleteUser = async function (
	identifier: string | number
): Promise<boolean> {
	if (typeof identifier == "number") {
		var userResults = await userModel
			.findOneAndUpdate(
				{
					phoneNumber: identifier,
				},
				{
					"deleted.status": true,
					"deleted.when": Date.now(),
				},
				{
					new: true,
				}
			)
			.select("deleted");
	} else {
		var userResults = await userModel
			.findOneAndUpdate(
				{
					email: identifier,
				},
				{
					"deleted.status": true,
					"deleted.when": Date.now(),
				},
				{
					new: true,
				}
			)
			.select("deleted");
	}

	if (userResults) {
		return true;
	}
	return false;
};

methods.sendCodeMail = async function () {
	var details: Document<returnInt> | null = await userModel.findByEmail(
		this.email
	);
	if (details) {
		await sendCodeMail(details);
		return true;
	} else {
		return false;
	}
};

statics.authenticate = async function (
	identifier: string | number,
	password: string
): Promise<boolean> {
	if (typeof identifier == "number") {
		var details = await userModel
			.findOne({
				phoneNumber: identifier,
			})
			.select("password");
	} else {
		var details = await userModel
			.findOne({
				email: identifier,
			})
			.select("password");
	}

	if (!details) {
		return false;
	}
	var result = await comparePassword(password, details.password);
	return result;
};

statics.findByPhoneNumber = async function (
	phoneNumber: number
): Promise<returnInt | null> {
	if (typeof phoneNumber != "number") {
		throw createError("Must be a number");
	}
	var details = await this.findOne({
		phoneNumber: phoneNumber,
	}).select("firstName lastName email phoneNumber registered customerNumber");
	return details;
};

statics.findByEmail = async function (
	email: string
): Promise<returnInt | null> {
	email = email.toLowerCase();
	var details: returnInt | null = await userModel
		.findOne({
			email,
		})
		.select("firstName lastName email phoneNumber registered customerNumber");
	return details;
};

const userModel = model<userInt, staticsInt>("USERS", user);

export { userModel, returnInt };
