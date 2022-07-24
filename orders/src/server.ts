import helmet from "helmet";
import morgan from "morgan";
import createHttpError from "http-errors";
import express, { Response, Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./utils";
import { cartRouter } from "./routes/cart";
import { ordersRouter } from "./routes/orders";
import { transRouter } from "./routes/transactions";
import { config } from "./configs/configs";
var app = express();

// handle the errors that may arise

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

try {
	connection();
} catch (error) {
	console.log("Cannot start the database");
}

app.use("/orders/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/orders/pay", transRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
	console.log("orders");
	console.log(req.url);
	next(createHttpError(404, "we did not find the page"));
});

app.use(function (
	err: ErrorEvent,
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	res.status(500).json({
		error: err.message,
	});
});

app.listen(5004, () => {
	console.log("Server has started at http://localhost:5004");
});

export default app;
