
import { Schema,model,Model } from "mongoose";
import categoryModel from "./categories";


const productSchema = new Schema({
    productNumber:{
        type:String
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categoryModel"
    },
    description: {
        type: String
    },
    discount: {
        type: Number,
        min: 0,
        max: 70,
        default: 10
    },
    price:{
        type:Number,
        min:0
    },
    tags: [{
        tagName: {
            type: String
        }
    }],
    productPic: [{
        location: {
            type: String
        }
    }],
    quantity:{
        type:Number,
        default:0
    }
}, {
    timestamps: true,
    collection: "Products"
})
const {
    methods,
    statics
} = productSchema;

statics.findByName = async function (productName) {
    var details = await productModel.findOne({
        productName
    }).select("-discount -category")
    details.totalPrice = details.price * (details.discount/100);
    return details;
}

statics.findByCategory = async function (categoryName) {
    var categoryId = await categoryModel.findOne({categoryName}).select("id");
    var products = await productModel.findOne({category:categoryId});
    return products;
}

statics.findByPriceRange = async function (low, high) {
    var details = await productModel.find()
    return
}
statics.findByTagName = async function (tagName) {
    const details = await productModel.find({"tags.tagname":tagName});
}

var productModel = model("Products", productSchema)
export {productModel}