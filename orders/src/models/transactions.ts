/**
Schema for the MPesa transactions that are taking place within the organisation
 */
import {Schema,model,Types,Model,Document} from "mongoose";


interface transId{
    user:Types.ObjectId,
    orders:Types.ObjectId,
    mode:string,
    amount:number,
    complete:boolean,
    recieptId:string,
}

const transactionSchema = new Schema<transId,Model<transId>>({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    orders: {
        type:Schema.Types.ObjectId,
        ref:"orderModel"
    },
    mode:{
        type:String,
        enum:["CASH","MPESA"],
        default:"CASH"
    },
    amount:{
        type:Number
    },
    complete: {
        type: Boolean,
        default: false
    },
    recieptId:{
        type:String
    },

}, {
    timestamps: true,
    collection: "Transctions"
});


const transactionModel = model<transId,Model<transId>>("transactions",transactionSchema)

export {transactionModel}