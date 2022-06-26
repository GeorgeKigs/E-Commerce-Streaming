import { Schema, model, Model, Types, Document } from "mongoose";
import categoryModel from "./categories";

interface Prods extends Document {
	productNumber: string;
	productName: string;
	category: Types.ObjectId;
	description: string;
	discount: number;
	price: number;
	totalPrice?: number;
	quantity: number;
	tags: Types.Array<{
		tagName: string;
	}>;
	productPic: Types.Array<{
		location: string;
	}>;
}

interface productStatics extends Model<Prods> {
	findByName(productName: string): Promise<Prods[] | null>;
	findByCategory(categoryName: string): Promise<Prods[] | null>;
	findByPriceRange(
		name: string,
		low: number,
		high: number
	): Promise<Prods[] | null>;
	findByTagName(tagName: string): Promise<Prods[] | null>;
}

const productSchema = new Schema<Prods, productStatics>(
	{
		productNumber: {
			type: String,
		},
		productName: {
			type: String,
			lowercase: true,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "categoryModel",
			required: true,
		},
		description: {
			type: String,
		},
		discount: {
			type: Number,
			min: 0,
			max: 70,
			default: 10,
		},
		price: {
			type: Number,
			min: 0,
		},
		tags: [
			{
				tagName: {
					type: String,
				},
			},
		],
		productPic: [
			{
				location: {
					type: String,
				},
			},
		],
		quantity: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		collection: "Products",
	}
);
const { statics } = productSchema;

productSchema.pre("deleteOne", (next) => {
	/* 
    check the orders to be deleted, carts to be updated and 
    * what is to happen if the order is in the cart
    */
	next();
});

statics.findByName = async function (
	productName: string
): Promise<Prods[] | null> {
	var details = await productModel
		.find({
			productName: {
				$regex: `*${productName}*`,
				$options: "i",
			},
		})
		.select("-discount -category")
		.limit(10);

	// details.forEach((detail) => {
	// 	detail.totalPrice = detail.price * (detail.discount / 100);
	// });
	return details;
};

statics.findByCategory = async function (
	categoryName: string
): Promise<Prods[] | null> {
	var categoryId = await categoryModel
		.findOne({ categoryName: { $regex: `*${categoryName}*` }, $options: "i" })
		.select("_id");
	if (categoryId) {
		var products = await productModel
			.find({ category: categoryId })
			.select({ _id: 0 })
			.limit(10);
		return products;
	}
	return null;
};

statics.findByPriceRange = async function (
	name: string,
	low: number,
	high: number
): Promise<Prods[] | null> {
	var details = await productModel
		.find({
			productName: { $regex: `*${name}*`, $options: "i" },
			price: { $gte: low, $lte: high },
		})
		.select("-discount -category")
		.limit(10);
	return details;
};

statics.findByTagName = async function (
	tagName: string
): Promise<Prods[] | null> {
	const details = await productModel
		.find({ "tags.tagname": { $regex: `*${tagName}*`, $options: "i" } })
		.select("-discount -category")
		.limit(10);
	return details;
};

var productModel = model<Prods, productStatics>("Products", productSchema);
export { productModel };
