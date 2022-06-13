import { Schema, model, Model, Types } from "mongoose";

interface categoryInt {
	categoryNumber: number;
	categoryName: string;
	description: string;
	categoryPics: Types.Array<{
		location: string;
	}>;
	deleted: {
		when: Date;
		status: boolean;
	};
}

interface staticCartInts extends Model<categoryInt> {
	findCategoryName(categoryName: string): Promise<categoryInt | null>;
	deleteCategory(categoryName: string): Promise<boolean>;
}

const categorySchema = new Schema<categoryInt, staticCartInts>({
	categoryNumber: {
		type: Number,
	},
	categoryName: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	categoryPics: [
		{
			location: {
				type: String,
			},
		},
	],
	deleted: {
		status: {
			type: Boolean,
			default: false,
		},
		when: {
			type: Date,
			default: Date.now,
		},
	},
});

const { statics } = categorySchema;

categorySchema.pre("findOneAndUpdate", async function (next) {
	//@ts-ignore
	if (this._update.categoryPics) {
		const error = new Error("cannot update the location of a picture");
		next(error);
	}

	next();
});

categorySchema.pre("save", async function (next) {
	var details = await categoryModel.findCategoryName(this.categoryName);
	if (details) {
		const error = new Error("category Already exists");
		next(error);
	}
	next();
});

statics.findCategoryName = async function (
	categoryName: string
): Promise<categoryInt | null> {
	var details = await categoryModel.findOne({ categoryName });
	return details;
};

statics.deleteCartegory = async function (
	categoryName: string
): Promise<boolean> {
	var details = await categoryModel.findOneAndUpdate(
		{ categoryName },
		{ "deleted.status": true, "deleted.when": Date.now() }
	);
	return true;
};

const categoryModel = model<categoryInt, staticCartInts>(
	"Category",
	categorySchema
);

export default categoryModel;
