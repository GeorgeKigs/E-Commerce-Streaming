const mongoose = require("mongoose");
const cartModel = require("./cart");
const userModel = require("./users");

const {
    Schema
} = mongoose;


const orderSchema = new Schema({
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
    stage: {
        type: String,
        enum: ['transit', 'complete', 'begin']
    },
    totalPrice:{
        type:Number,
        default:0,
        required:true
    },
    cartId:{
        type:Schema.Types.ObjectId,
        ref:"cartModel",
        required:true
    }
}, {
    timestamps: true,
    collection: "ORDERS"
});

const {
    methods,
    statics
} = orderSchema;

orderSchema.pre("save", async function(next){
    try {
      this.complete = false;
      let user = await userModel.findById(this.user); 
      
      var calculate = function(){
          var price = 0
          this.products.forEach(element => {
            // TODO:  confirm the status of this calculation
            price += element.quantity * element.price
          });
          return price;
      } 
      this.totalPrice = calculate()
      
      if (!user){
        next("User must be registered.")
      }
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



var orderModel = mongoose.model("ORDERS", orderSchema)
module.exports = orderModel;