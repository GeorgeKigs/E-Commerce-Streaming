import { productModel } from "../models/products";
import express, { Request, Response, NextFunction } from "express";
import categoryModel from "../models/categories";
import {
  add_product,
  del_product,
  change_price,
  change_quan,app.use("/", indexRouter);
  // app.use("/users", usersRouter);
  app.use("/", indexRouter);
// app.use("/users", usersRouter);

// app.use("/products", productsRouter);
// app.use("/orders", ordersRouter);
// app.use("/cart", cartRouter);
// app.use("/categories", categoriesRouter);
  // app.use("/products", productsRouter);
  // app.use("/orders", ordersRouter);
  // app.use("/cart", cartRouter);
  // app.use("/categories", categoriesRouter);
} from "../controllers/products";
import { auth_req } from "../middleware/auth";

var router = express.Router();

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resource");
});

router.post("/add", auth_req, add_product);
router.post("/delProduct", auth_req, del_product);
router.post("/changePrice", auth_req, change_price);
router.post("/changeQuantity", auth_req, change_quan);

export { router as productsRouter };
