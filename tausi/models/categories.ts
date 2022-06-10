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
	delete(categoryName: string): Promise<boolean>;
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

statics.findCategoryName = async function (
	categoryName: string
): Promise<categoryInt | null> {
	var details = await categoryModel.findOne({ categoryName });
	return details;
};

statics.delete = async function (categoryName: string): Promise<boolean> {
	var details = await categoryModel.findOne({ categoryName });
	return true;
};

categorySchema.pre("findOneAndUpdate", async function (next) {
	var details = await categoryModel.findOne({});
	next();
});

const categoryModel = model<categoryInt, staticCartInts>(
	"Category",
	categorySchema
);

export default categoryModel;
