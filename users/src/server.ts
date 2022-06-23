import helmet from "helmet";
import morgan from "morgan";
import createHttpError from "http-errors";
import express, { Response, Request, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { usersRouter } from "./routes/users";
import cors from "cors";
import { connection } from "./utils";

var app = express();
connection();
// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", usersRouter);

// addition of the cors

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
		error: err.message,
	});
});

app.listen(5002, () => {
	console.log("Server has started at http://localhost:5002");
});

export default app;
