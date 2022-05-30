import { productModel } from "../models/products";
import express,{Request,Response,NextFunction}  from 'express';
import categoryModel from "../models/categories";



var router = express.Router();


router.get('/', function(req:Request,res:Response,next:NextFunction) {
  res.send('respond with a resource');
});

router.post('/add',async (req:Request,res:Response,next:NextFunction)=>{
  try {

    let product = req.body;

    const id = await categoryModel.findOne({
      "categoryName":product.productLine
    },{_id:1})

    console.log(id)

    product["category"] = id._id 
    
    const products = new productModel(product)
    await products.save()

    res.json(
      {"success":true,"return":0}
    )
  } catch (error) {
    next(error)
  }
})

router.post('')

export {router as productsRouter}
