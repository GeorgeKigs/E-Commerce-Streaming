import fetch from "node-fetch";
// import datetime from "node-datetime";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

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
		const consumer_key = process.env["CONS_KEY"];
		const consumer_secret = process.env["CONS_SECRET"];
		const authorization = process.env["MPESA_AUTH"];

		let buffer = Buffer.from(`${consumer_key}:${consumer_secret}`, "utf-8");
		let key = buffer.toString("base64");

		let req = await fetch(
			`https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=${authorization}`,
			{
				headers: {
					Authorization: `Basic ${key}`,
				},
			}
		);
		var data = (await req.json()) as any;
		return data;
	};

	private get_time = () => {
		// const dt = datetime.create();
		// return dt.format("YmdHMS");4
		return "";
	};

	private get_pass = () => {
		const pass_key = process.env["PASS_KEY"];
		const time = this.time;
		const pass = Buffer.from(
			`${this.bus_no}${pass_key}${time}`,
			"utf-8"
		).toString("base64");
		return pass;
	};

	private define_data = (amt: number, PhoneNumber: number, order: string) => {
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
			AccountReference: `${company}`,
			TransactionDesc: `Payment of order :${order}`,
		};
		return data;
	};

	public pay = async (amt: number, PhoneNumber: number, product: string) => {
		let data = this.define_data(amt, PhoneNumber, product);
		let token = (await this.access_token)["access_token"];
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

export default MpesaImp;
