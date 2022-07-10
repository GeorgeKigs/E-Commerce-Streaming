import helmet from "helmet";
import morgan from "morgan";
import createHttpError from "http-errors";
import express, { Response, Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { productsRouter } from "./routes/products";
import cors from "cors";
import { connection } from "./utils";
import { categoriesRouter } from "./routes/categories";

var app = express();

// handle the errors that may arise
(async () => {
	try {
		await connection();
		console.log("connected to db");
	} catch (error) {
		console.log(error);
	}
})();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/products/", productsRouter);
app.use("/products/categories", categoriesRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
	next(createHttpError(404, "we did not find the page"));
});

// error handler
app.use(function (
	err: ErrorEvent,
	req: Request,
	res: Response,
	next: NextFunction
) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(500).json({
		success: false,
		error: err.message,
	});
});

app.listen(5003, () => {
	console.log("Server has started at http://localhost:5003");
});

export default app;
