import { Schema, model, Model, Types, Document } from "mongoose";
import { config } from "../configs/configs";
import { cartModel } from "./cart";

interface prodsInt extends Document {
	product: Types.ObjectId;
	price: number;
	quantity: number;
}
interface orderInt {
	orderNumber: number;
	user: Types.ObjectId;
	address: {
		street: string;
		zipcode: string;
		city: string;
		date: Date;
	};
	products: Types.DocumentArray<prodsInt>;
	complete: boolean;
	cartId: Types.ObjectId;
	stage: string;
}
interface staticInt extends Model<orderInt> {
	updateStatus(orderId: string): Promise<boolean>;
}

const orderSchema = new Schema<orderInt, staticInt>(
	{
		// Identified by orderNumber
		orderNumber: {
			type: Number,
		},
		//Use customerNumber to get the _id
		user: {
			type: Schema.Types.ObjectId,
			ref: "usersModel",
			required: true,
		},
		address: {
			street: {
				type: String,
			},
			zipcode: {
				type: String,
			},
			city: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now(),
			},
		},

		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "categoryModel",
				},
				price: {
					type: Number,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
			},
		],
		complete: {
			type: Boolean,
			default: false,
		},
		//status of the order
		stage: {
			type: String,
			enum: [
				"Shipped",
				"Resolved",
				"Cancelled",
				"On Hold",
				"Disputed",
				"In Process",
			],
		},

		// get the transaction
		cartId: {
			type: Schema.Types.ObjectId,
			ref: "cartModel",
		},
	},
	{
		timestamps: true,
		collection: "Orders",
	}
);

const { statics } = orderSchema;

orderSchema.pre("save", async function (next) {
	const address = await (await fetch(`${config.addr_url}/${this.user}`)).json();
	this.address = { ...address.address[0] };
	next();
});

statics.updateStatus = async function (
	orderId: string,
	stage: string
): Promise<boolean> {
	var order = await orderModel.findByIdAndUpdate(
		orderId,
		{
			$set: { stage },
		},
		{ cartId: 1 }
	);
	if (!order) {
		return true;
	}

	return false;
};

var orderModel = model<orderInt, staticInt>("Orders", orderSchema);
export { orderModel };
