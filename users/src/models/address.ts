import { Schema, model, Model, Document, Types } from "mongoose";

interface addrInt {
	user: Types.ObjectId;
	address: Types.Array<{
		street: string;
		zipcode: String;
		phoneNumber: Number;
		city: String;
		date: Date;
	}>;
}

const addrSchema = new Schema<addrInt, Model<addrInt>>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "userModel",
		},
		address: [
			{
				street: {
					type: String,
				},
				zipcode: {
					type: String,
				},
				city: {
					type: String,
				},
				phoneNumber: {
					type: Number,
				},
				date: {
					type: Date,
					default: Date.now(),
				},
			},
		],
	},
	{
		timestamps: true,
		collection: "Address",
	}
);

const addrModel = model<addrInt>("Address", addrSchema);
export default addrModel;
