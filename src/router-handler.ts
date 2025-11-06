import type { NextFunction, Request, Response } from "express";
import z from "zod";

import { I18n } from "./i18n.js";
import { HttpStatusCode, RequestDataLocation } from "./types.js";

export interface RouteHandlerOptions<
	TRequestSpecification extends Partial<Record<RequestDataLocation, z.ZodType>>,
	TResponseSpecification extends Partial<
		Record<HttpStatusCode, { description: I18n; schema?: z.ZodType }>
	>
> {
	summary: I18n;
	description: I18n;
	middleware: Array<(params: { req: Request; res: Response; next: NextFunction }) => void>;
	handler: (
		req: Request,
		res: Response
	) => Promise<
		{
			[TStatus in keyof TResponseSpecification]: TResponseSpecification[TStatus] extends {
				schema: infer S;
			}
				? [status: TStatus, data: z.infer<S>]
				: [status: TStatus];
		}[keyof TResponseSpecification]
	>;

	request: Partial<{
		query: TRequestSpecification["query"];
		body: TRequestSpecification["body"];
		params: TRequestSpecification["params"];
		headers: TRequestSpecification["headers"];
	}>;

	responses: TResponseSpecification;
}

export class RouteHandlerImpl<
	TRequestSpecification extends Partial<Record<RequestDataLocation, z.ZodType>>,
	TResponseSpecification extends Partial<
		Record<HttpStatusCode, { description: I18n; schema?: z.ZodType }>
	>
> implements RouteHandlerOptions<TRequestSpecification, TResponseSpecification>
{
	summary: I18n;
	description: I18n;
	middleware: RouteHandlerOptions<TRequestSpecification, TResponseSpecification>["middleware"];
	handler: RouteHandlerOptions<TRequestSpecification, TResponseSpecification>["handler"];
	request: RouteHandlerOptions<TRequestSpecification, TResponseSpecification>["request"];
	responses: RouteHandlerOptions<TRequestSpecification, TResponseSpecification>["responses"];

	constructor(options: RouteHandlerOptions<TRequestSpecification, TResponseSpecification>) {
		this.summary = options.summary;
		this.description = options.description;
		this.middleware = options.middleware;
		this.handler = options.handler;
		this.request = options.request;
		this.responses = options.responses;
	}
}

export const RouteHandler = <
	TRequestSpecification extends Partial<
		Record<"query" | "body" | "params" | "headers", z.ZodType>
	>,
	TResponseSpecification extends Partial<
		Record<HttpStatusCode, { description: I18n; schema?: z.ZodType }>
	>
>(
	options: RouteHandlerOptions<TRequestSpecification, TResponseSpecification>
): RouteHandlerImpl<TRequestSpecification, TResponseSpecification> => {
	return new RouteHandlerImpl(options);
};
