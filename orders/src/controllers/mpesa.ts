import fetch from "node-fetch";
// @ts-ignore
import datetime from "node-datetime";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config({ path: "env" });

class MpesaImp {
	private time: string;
	private access_token: any;
	private pass: string;
	private authoriation_key: string;
	private bus_no: string;

	constructor() {
		this.time = this.get_time();
		this.access_token = this.get_access_token();
		this.pass = this.get_pass();
		this.authoriation_key = "";
		this.bus_no = "";
	}

	private get_access_token = async (): Promise<any | null> => {
		const consumer_key = "phoAcAdoyM5N6IVGGfI5uxA4y4cKdeKv";
		const consumer_secret = "MRGvmpPfDsJ2URkz";
		const authorization = "client_credentials";

		// CONS_KEY =
		// CONS_SECRET =
		// PASS_KEY =
		let buffer = Buffer.from(`${consumer_key}:${consumer_secret}`, "utf-8");

		let key = buffer.toString("base64");
		console.log(key);
		// @ts-ignore
		let req = await axios.get(
			`https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
			{
				headers: {
					Authorization: `Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==`,
				},
			}
		);
		var data = req.data as any;
		console.log(data);
		return data;
	};

	private get_time = () => {
		const dt = datetime.create();
		return dt.format("YmdHMS");
		// return "";
	};

	private get_pass = () => {
		const pass_key =
			"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
		const time = this.time;
		const pass = Buffer.from(
			`${this.bus_no}${pass_key}${time}`,
			"utf-8"
		).toString("base64");
		return pass;
	};

	private define_data = (amt: number, PhoneNumber: number) => {
		let callback_url = process.env["MPESA_CALLBACK"];
		let company = process.env["COMPANY"];

		const data = {
			BusinessShortCode: this.bus_no,
			Password: this.pass,
			Timestamp: this.time,
			TransactionType: "CustomerPayBillOnline",
			Amount: amt,
			PartyA: PhoneNumber,
			PartyB: this.bus_no,
			PhoneNumber: PhoneNumber,
			CallBackURL: `${callback_url}`,
			AccountReference: `Kikoto Calc`,
			TransactionDesc: `PAY TO TAUSI`,
		};
		return data;
	};

	public pay = async (amt: number, PhoneNumber: number) => {
		let data = this.define_data(amt, PhoneNumber);
		let token = (await this.access_token)["access_token"];

		console.log(token);
		// @ts-ignore
		let new_data: any = await fetch(
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
			{
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		new_data = await new_data.json();
		console.log(new_data);
	};
}

const verification = async () => {};

const messageCallback = async () => {};

export { MpesaImp };
