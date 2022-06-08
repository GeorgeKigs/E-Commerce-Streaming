import {Schema,model,Model, Types} from "mongoose"



interface categoryInt{
    categoryNumber:number,
    categoryName: string,
    description: string,
    categoryPics: Types.Array<{
        location:string
    }>
}


const categorySchema = new Schema<categoryInt,Model<categoryInt>>({
    categoryNumber:{
        type:Number,
    },
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    categoryPics: [{
        location: {
            type: String
        }
    }]
})

const {
    statics
} = categorySchema;

statics.findCategoryName = async function (categoryName:string):Promise<categoryInt|null> {
    var details = await categoryModel.findOne({categoryName})
    return details
}


const categoryModel =  model("CATEGORY", categorySchema);

export default categoryModel 