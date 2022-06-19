import {Schema,model,Model,Types,Document} from 'mongoose';
import {cartModel} from "./cart";
import {userModel} from "./users";


interface prodsInt extends Document{
    product:Types.ObjectId,
    price:number,
    quantity: number
}
interface orderInt{
    orderNumber:number,
    user:Types.ObjectId,
    products:Types.DocumentArray<prodsInt>,
    complete:boolean,
    cartId:Types.ObjectId,
    stage:string
}
interface staticInt extends Model<orderInt>{
    updateStatus(orderId:string):Promise<boolean>
}


const orderSchema = new Schema<orderInt,staticInt>({
    // Identified by orderNumber
    orderNumber:{
        type:Number
    },
    //Use customerNumber to get the _id
    user: {
        type: Schema.Types.ObjectId,
        ref:"usersModel",
        required: true
    },

    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "categoryModel"
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    complete: {
        type: Boolean,
        default: false
    },
    //status of the order
    stage: {
        type: String,
        enum: ['Shipped','Resolved','Cancelled','On Hold',
        'Disputed','In Process']
    },

    //get the cartId based on the orderNo
    cartId:{
        type:Schema.Types.ObjectId,
        ref:"cartModel",
    }
}, {
    timestamps: true,
    collection: "Orders"
});

const {
    methods,
    statics
} = orderSchema;

orderSchema.pre("save", async function(next){
      this.complete = false;
      let user = await userModel.findById(this.user); 
      if (!user){
        let error = new Error("User must be registered.")
        next(error)
      }
      
      next();
})

statics.updateStatus = async function(orderId:string):Promise<boolean>{

    var order = await orderModel.findByIdAndUpdate(
        orderId, {
            $set:{complete:true}
        },{cartId:1}
        );
    if(!order){
        return true
    }

    return false
}



var orderModel = model<orderInt,staticInt>("Orders", orderSchema)
export {orderModel};