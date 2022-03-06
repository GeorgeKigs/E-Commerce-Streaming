const mongoose = require("mongoose");
const productModel = require("./products");
const userModel = require("./users");
const {
    Schema
} = mongoose;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref:"userModel",
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "categoryModel",
            required:true
        },
        price: {
            type: Number,
            required: true
        },
        available:{
            type:Boolean,
            default:true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    
}, {
    timestamps: true,
    collection: "CART"
})

cartSchema.pre("save", async function(next){
    try {
      this.complete = false;
      let user = await userModel.findById(this.user); 
      
      if (!user){
        next("User must be registered.")
      }
      next();
    } catch (error) {
        console.log(error)
        next(error)
    }
});

statics.addProduct = async function(products){

    const user = await cartModel.findOne({user:this.user})
    if(!user){
        Error("Cannot update the user details");
    }
    await products.forEach(element=>{
        const id = element.product_id;
        const product = await productModel.findById(id,{price:1})
        cartModel.updateOne(
            {user:this.user},
            {$push:{
                products:{
                    product:id,
                    quantity: element.quantity,
                    price:product.price
                }
            }}
            )
    })
};

statics.removeProduct = async function(products){

    const user = await cartModel.findOne({user:this.user})
    if(!user){
        Error("Cannot update the user details");
    }
    await products.forEach(element=>{
        const id = element.product_id;
        cartModel.updateOne(
            {user:this.user},
            {$pull:{
                products:{
                    product:id,
                }
            }}
            )
    })
};

statics.addProductQuantity = async function(products){

    const user = await cartModel.findOne({user:this.user})
    
    await products.forEach(element=>{
        const id = element.product_id;
        const product = await productModel.findById(id,{price:1})
        cartModel.updateOne(
            {user:this.user,"products.0.product_id":id},
            {
                $inc:{"products.$.quantity":element.quantity}  
            }
            )
    })
};

statics.removeProductQuantity = async function(products){

    const user = await cartModel.findOne({user:this.user})
    
    await products.forEach(element=>{
        const id = element.product_id;
        const product = await productModel.findById(id,{price:1})
        cartModel.updateOne(
            {user:this.user,"products.0.product_id":id},
            {
                $inc:{"products.$.quantity":-element.quantity}
            }
            )
    })
};

methods.findTotalProducts = async function(){
    const details = await cartModel.findOne(
        {user:this.user},
        {products:1}
    )
    var finalCount = details.products.count();
    return finalCount;
}

methods.findTotalPrice = async function(){
    const details = await cartModel.findOne(
        {user:user_id},
        {products:1}
    )
    var getPrice = ()=>{
        var price = 0
        details.products.forEach(element =>{
            price += element.price * element.quantity;
        })
        return price;
    }
    var totalPrice = getPrice();
    return totalPrice;
}

const cartModel = mongoose.model("CART",cartSchema)
module.exports = cartModel;