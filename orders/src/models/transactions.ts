/**
Schema for the MPesa transactions that are taking place within the organisation
 */
import { Schema, model, Types, Model, Document } from "mongoose";
import { cartModel } from "./cart";
import { orderModel } from "./orders";

interface transId {
	user: Types.ObjectId;
	cartId: Types.ObjectId;
	mode: string;
	amount: number;
	complete: boolean;
	recieptId: string;
}

const transactionSchema = new Schema<transId, Model<transId>>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		cartId: {
			type: Schema.Types.ObjectId,
			ref: "orderModel",
		},
		mode: {
			type: String,
			enum: ["CASH", "MPESA", "PAYPAL"],
			default: "CASH",
		},
		amount: {
			type: Number,
		},
		complete: {
			type: Boolean,
			default: false,
		},
		recieptId: {
			type: String,
		},
	},
	{
		timestamps: true,
		collection: "Transctions",
	}
);

transactionSchema.pre("updateOne", (next) => {
	next(Error("Cannot update a transaction"));
});

transactionSchema.pre("deleteOne", (next) => {
	next(Error("Cannot delete any transaction"));
});

transactionSchema.post("save", async (document) => {
	const cart = await cartModel
		.findOne({
			user: document.user,
		})
		.select("-_id");
	const data = {
		user: cart?.user,
		products: cart?.products,
		complete: document.complete,
		stage: "In Process",
		cartId: cart?._id,
	};
	const order_data = await orderModel.create(data);
	await order_data.save();
	await cartModel.deleteOne({ user: document.user });
});

const transactionModel = model<transId, Model<transId>>(
	"transactions",
	transactionSchema
);

export { transactionModel };
