import { Schema, model, Types, Model, Document } from "mongoose";
import { productModel } from "./products";
import { userModel } from "../../users/models/users";

interface prodInt {
	product: Types.ObjectId;
	price: number;
	available: boolean;
	quantity: number;
}

interface prod extends prodInt, Document {}

interface cartInt {
	orderNumber: number;
	user: Types.ObjectId;
	products: Types.DocumentArray<prod>;
}

const cartSchema = new Schema<cartInt, Model<cartInt>>(
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
					ref: "categoryModel",
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

const { statics, methods } = cartSchema;

cartSchema.pre("save", async function (next) {
	let user = await userModel.findById(this.user);
	if (!user) {
		let error = new Error("User must be registered.");
		next(error);
	}
	next();
});

statics.addProduct = async function (products: cartInt) {
	const user = await cartModel.findOne({ user: products.user });
	if (!user) {
		Error("Cannot update the user details");
	}

	products.products.forEach(async (element) => {
		const id = element.product;
		const product = await productModel.findById(id, { price: 1 });
		cartModel.updateOne(
			{ user: products.user },
			{
				$push: {
					products: {
						product: id,
						quantity: element.quantity,
						price: product.price,
					},
				},
			}
		);
	});
};

statics.removeProduct = async function (products: cartInt) {
	const user = await cartModel.findOne({ user: products.user });
	if (!user) {
		Error("Cannot update the user details");
	}
	products.products.forEach(async (element) => {
		const id = element.product;
		await cartModel.updateOne(
			{ user: products.user },
			{
				$pull: {
					products: {
						product: id,
					},
				},
			}
		);
	});
};

statics.addProductQuantity = async function (products: cartInt) {
	const user = await cartModel.findOne({ user: products.user });

	products.products.forEach(async (element) => {
		const id = element.product;
		await cartModel.updateOne(
			{ user: products.user, "products.0.product_id": id },
			{
				$inc: { "products.$.quantity": element.quantity },
			}
		);
	});
};

statics.removeProductQuantity = async function (products: cartInt) {
	const user = await cartModel.findOne({ user: products.user });

	products.products.forEach(async (element) => {
		const id = element.product;
		await cartModel.updateOne(
			{ user: products.user, "products.0.product_id": id },
			{
				$inc: { "products.$.quantity": -element.quantity },
			}
		);
	});
};

methods.findTotalProducts = async function () {
	// const details = await cartModel.findOne(
	//     {user:this.user},
	//     {products:1}
	// )
	var finalCount = this.products.length;
	return finalCount;
};

methods.findTotalPrice = async function () {
	// const details = await cartModel.findOne(
	//     {user:this.user},
	//     {products:1}
	// )
	var getPrice = () => {
		var price = 0;
		this.products.forEach((element) => {
			price += element.price * element.quantity;
		});
		return price;
	};
	var totalPrice = getPrice();
	return totalPrice;
};

const cartModel = model("Cart", cartSchema);
export { cartModel };
