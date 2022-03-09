var express = require('express');
const { categoryModel } = require('../models/categories');
const productModel = require('../models/products');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',async (res,req,next)=>{
  try {
    let product = res.body;

    const id = await categoryModel.findOne({
      "categoryName":product.productLine
    },{_id:1})

    console.log(id)

    product["category"] = id._id 
    
    const products = new productModel(product)
    await products.save()

    req.json(
      {"success":true,"return":0}
    )
  } catch (error) {
    next(error)
  }
})

router.post('')
module.exports = router;
