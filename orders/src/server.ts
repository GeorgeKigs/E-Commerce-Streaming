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

var app = express();

// handle the errors that may arise

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
	try {
		connection();
	} catch (error) {
		next(createHttpError("Cannot start the database"));
	}
});

app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/pay", transRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
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
