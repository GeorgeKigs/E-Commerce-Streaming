var express = require('express');
const cartModel = require('../models/cart');
const productModel = require('../models/products');
const userModel = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',async (res,req,next)=>{
  try {
    // console.log(res.body)
    var data = res.body
    // find the users in the system
    const user = await userModel.findOne({
      customerNumber:data.user
    },{_id:1})
    
    if (user){
      data.user = user._id
    }

    for (const key in data.products) {
      const element = data.products[key];

      const product = await productModel.findOne({
        productNumber:element.product
      },{_id:1,price:1});
      element.product = product._id;
      element.price = product.price;
    }
 
    const cart = new cartModel(data);
    await cart.save()


    req.json(
      {"success":true,"return":0}
    )
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('')
module.exports = router;