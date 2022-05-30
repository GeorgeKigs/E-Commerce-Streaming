import {Schema,model} from 'mongoose';
import {cartModel} from "./cart";
import {userModel} from "./users";




const orderSchema = new Schema({
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
    totalPrice:{
        type:Number,
        default:0,
        required:true
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
    try {
      this.complete = false;
      let user = await userModel.findById(this.user); 

      if (!user){
        next("User must be registered.")
      }
      
    //   var calculate = function(){
    //       var price = 0
    //       this.products.forEach(element => {
    //         // TODO:  confirm the status of this calculation
    //         price += element.quantity * element.price
    //       });
    //       return price;
    //   } 
    //   this.totalPrice = calculate()
      
      
      next();
    } catch (error) {
        console.log(error)
        next(error)
    }
})

statics.updateStatus = async function(orderId){
    try{
        var order = await orderModel.findById(orderId,{cartId:1});
        if(!order){
            next("Must be a registered user")
        }
        await order.updateOne(
            {_id:orderId},
            {
                $set:{complete:true}
            })
        await cartModel.deleteOne({_id:order.cartId})
    }catch(error){
        console.log(error)
        next(error)
    }
}



var orderModel = model("Orders", orderSchema)
export {orderModel};