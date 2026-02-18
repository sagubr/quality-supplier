import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.config";
import { env } from "../config/env.config";

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	_next: NextFunction,
) {
	logger.error(
		{
			err,
			method: req.method,
			url: req.originalUrl,
			body: req.body,
			query: req.query,
			params: req.params,
			userAgent: req.headers["user-agent"],
		},
		err.message,
	);

	const statusCode = err.statusCode || 500;
	const envProduction = env.NODE_ENV === "production";

	res.status(statusCode).json({
		message: envProduction ? "Internal Server Error" : err.message,
	});
}
