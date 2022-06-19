import express,{Request,Response,NextFunction}  from 'express';
import { cartModel } from '../models/cart';
import { productModel } from '../models/products';
import { userModel } from '../models/users';



var router = express.Router();

/* GET users listing. */
router.get('/', (req:Request, res:Response, next:NextFunction)=>{
  res.send('respond with a resource');
});

router.post('/add',async (req:Request, res:Response, next:NextFunction)=>{
  try {

    var data = req.body
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
      console.log(product)
      element.product = product._id;
      element.price = product.price;
    }
 
    const cart = new cartModel(data);
    await cart.save()


    res.json(
      {"success":true,"return":0}
    )
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('')
export {router as cartRouter};