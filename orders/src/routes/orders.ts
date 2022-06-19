import express,{Request,Response,NextFunction}  from 'express';
import { cartModel } from '../models/cart';
import { orderModel } from '../models/orders';
import { productModel } from '../models/products';
import { userModel } from '../models/users';



var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/add", async (res, req, next) => {
  try {
    let body = res.body;
    // find the users in the system

    const user = await userModel.findOne(
      {
        customerNumber: body.user,
      },
      { _id: 1 }
    );

    const cart = await cartModel.findOne(
      {
        orderNumber: body.orderNumber,
      },
      { _id: 1 }
    );

    if (user) {
      body.user = user._id;
    }
    if (cart) {
      body["cartId"] = cart._id;
    } else {
      body["cartId"] = null;
    }

    // find the product id for each product being used
    // find the price for each product being sold
    for (const key in body.products) {
      const element = body.products[key];
      const product = await productModel.findOne(
        {
          productNumber: element.product,
        },
        { _id: 1, price: 1 }
      );

      element.product = product._id;
      element.price = product.price;
    }
    // console.log(body)
    // save the file
    const order = new orderModel(body);
    await order.save();

    req.json({ success: true, return: 0 });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("");

export {router as ordersRouter}
