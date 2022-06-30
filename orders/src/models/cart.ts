import createHttpError from "http-errors";
import { Schema, model, Types, Model, Document } from "mongoose";

interface cartInt extends Document {
	orderNumber?: number;
	user: Types.ObjectId;
	products: Types.Array<{
		product: Types.ObjectId;
		price: number;
		available: boolean;
		quantity: number;
	}>;
}

interface cartStatics extends Model<cartInt> {
	addProduct(products: any): Promise<cartInt | null>;
	removeProduct(products: any): Promise<cartInt | null>;
	setProdQuantity(products: any): Promise<cartInt | null>;
	calculatePrice(cartId: string): Promise<number | null>;
	// removeProductQuantity(products: any): Promise<cartInt | null>;
}

const cartSchema = new Schema<cartInt, cartStatics>(
	{
		orderNumber: {
			type: Number,
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: "userModel",
			required: true,
		},

		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "productModel",
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
				available: {
					type: Boolean,
					default: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
			},
		],
	},
	{
		timestamps: true,
		collection: "Cart",
	}
);

const { statics } = cartSchema;

statics.addProduct = async function (products: any): Promise<cartInt | null> {
	const id = products.product;
	const product = await (await fetch(`{PROD_URL}/${id}`)).json();
	// check the quantity of the products
	var data = await cartModel.findOneAndUpdate(
		{ user: products.user },
		{
			$push: {
				products: {
					product: id,
					price: product.price,
					quantity: products.quantity,
				},
			},
		},
		{ new: true }
	);
	return data;
};

statics.removeProduct = async function (
	products: cartInt
): Promise<cartInt | null> {
	var prdts = products.products[0];
	const id = prdts.product;
	var data = await cartModel.findOneAndUpdate(
		{ user: products.user },
		{
			$pull: {
				products: {
					product: id,
				},
			},
		},
		{ new: true }
	);
	return data;
};

statics.setProdQuantity = async function (
	products: any
): Promise<cartInt | null> {
	const id = products.product;

	var data = await cartModel.findOneAndUpdate(
		{ user: products.user, "products.product_id": id },
		{
			$set: { "products.$.quantity": products.quantity },
		},
		{ new: true }
	);
	return data;
};
statics.calculatePrice = async (
	cart_id: cartInt["_id"]
): Promise<number | null> => {
	const cart = await cartModel.findById(cart_id);
	let total_price = 0;
	if (cart) {
		for await (const iterator of cart.products) {
			total_price += iterator.price * iterator.quantity;
		}
	}

	return total_price;
};
const cartModel = model<cartInt, cartStatics>("Cart", cartSchema);
export { cartModel, cartInt };
