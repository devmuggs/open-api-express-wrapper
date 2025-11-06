import type { NextFunction, Request, Response } from "express";
import z from "zod";

import { I18n } from "../core/i18n.js";
import { HttpStatusCode, RequestDataLocation } from "../index.js";

export interface HandlerOptions<
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
		res: Response,
		next: NextFunction
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

export class HandlerImpl<
	TRequestSpecification extends Partial<Record<RequestDataLocation, z.ZodType>>,
	TResponseSpecification extends Partial<
		Record<HttpStatusCode, { description: I18n; schema?: z.ZodType }>
	>
> implements HandlerOptions<TRequestSpecification, TResponseSpecification>
{
	summary: I18n;
	description: I18n;
	middleware: HandlerOptions<TRequestSpecification, TResponseSpecification>["middleware"];
	handler: HandlerOptions<TRequestSpecification, TResponseSpecification>["handler"];
	request: HandlerOptions<TRequestSpecification, TResponseSpecification>["request"];
	responses: HandlerOptions<TRequestSpecification, TResponseSpecification>["responses"];

	constructor(options: HandlerOptions<TRequestSpecification, TResponseSpecification>) {
		this.summary = options.summary;
		this.description = options.description;
		this.middleware = options.middleware;
		this.handler = options.handler;
		this.request = options.request;
		this.responses = options.responses;
	}
}

export const Handler = <
	TRequestSpecification extends Partial<
		Record<"query" | "body" | "params" | "headers", z.ZodType>
	>,
	TResponseSpecification extends Partial<
		Record<HttpStatusCode, { description: I18n; schema?: z.ZodType }>
	>
>(
	options: HandlerOptions<TRequestSpecification, TResponseSpecification>
): HandlerImpl<TRequestSpecification, TResponseSpecification> => {
	return new HandlerImpl(options);
};
