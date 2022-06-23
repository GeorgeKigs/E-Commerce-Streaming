import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import os from "node:os";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import { returnInt } from "./users";

interface mailInter {
	code: string;
	to: string;
	subject: string;
	mail: string;
}

export async function sendMail(mail: mailInter) {
	var account = "";
	var password = "";

	var transporter = nodemailer.createTransport({
		// @ts-ignore
		host: "smtp.ethereal.email",
		port: 587,
		secure: "",
		auth: {
			user: account,
			pass: password,
		},
	});

	await transporter.sendMail({
		from: ` User Admin<${account}>`,
		to: `${mail.to}`,
		subject: `${mail.subject}`,
		text: `${mail.mail}`,
	});
}
export function generateToken(data: any): string {
	var secretKey = "This is True";
	var data = data;
	var token = jsonwebtoken.sign(data, secretKey, {
		expiresIn: "1800s",
	});
	return token;
}

export async function verifyToken(token: string) {
	var secretKey = "This is True";
	try {
		var data = jsonwebtoken.verify(token, secretKey);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function hashPassword(password: string): Promise<string> {
	var salt = await bcryptjs.genSalt(10);

	var hash = await bcryptjs.hash(password, salt);
	return hash;
}

export async function comparePassword(
	password: string,
	hash: string
): Promise<boolean> {
	var result = await bcryptjs.compare(password, hash);
	return result;
}

export async function sendCodeMail(userdetails: any): Promise<void> {
	var secretCode: string = generateSecretCode();

	let mail: mailInter = {
		code: "",
		to: "",
		subject: "",
		mail: "",
	};
	mail.code = secretCode;
	mail.to = userdetails.email;
	mail.subject = "Verify Email";
	var token = generateToken(userdetails);

	const message = `
    Use the following URL to sign in: 
    http://${os.hostname()}/verify/token?${token}`;
	mail.mail = message;

	sendMail(mail);
}

var generateSecretCode = (exports.generateSecretCode = (): string => {
	return crypto.randomBytes(6).toString("utf-8");
});
