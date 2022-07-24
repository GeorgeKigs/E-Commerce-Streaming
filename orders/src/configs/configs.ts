import dotenv from "dotenv";

dotenv.config({ path: ".env" });

let config = {
	auth_url: process.env["AUTH_URL"],
	prod_url: process.env["PROD_URL"],
	addr_url: process.env["ADDR_URL"],
	client_id: process.env["CLIENT_ID"],
	mongodb_url: process.env["MONGODB_URL_DOCKER"] || process.env["MONGODB_URL"],
	jwt_secret: process.env["JWT_SECRET_KEY"],
	cons_key: process.env["CONS_KEY"],
	cons_secret: process.env["CONS_SECRET"],
	pass_key: process.env["PASS_KEY"],
	mpesa_auth: process.env["MPESA_AUTH"],
	paybill: process.env["PAYBILL"],
	mpesa_callback: process.env["MPESA_CALLBACK"],
	company: process.env["COMPANY"],
};

export { config };
