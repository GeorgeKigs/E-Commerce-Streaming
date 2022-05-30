/**
Schema for the MPesa transactions that are taking place within the organisation
 */
import {Schema,model,Types,Model,Document} from "mongoose";

interface orderInt extends Document{
    order:Types.ObjectId
}

interface transId{
    user:Types.ObjectId,
    orders:Types.DocumentArray<orderInt>,
    mode:string,
    amount:number,
    complete:boolean,
    transactionId:string,
    stage:string
}

const transactionSchema = new Schema<transId,Model<transId>>({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    orders: [{
        order:{
            type:Schema.Types.ObjectId,
            ref:"orderModel"
        }
    }],
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
    transactionId:{
        type:String
    },
    stage: {
        type: String,
        enum: ['TRANSIT', 'COMPLETE', 'BEGIN']
    }
}, {
    timestamps: true,
    collection: "ORDERS"
});


const transactionModel = model<transId,Model<transId>>("transactions",transactionSchema)

export {transactionModel}