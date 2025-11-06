import type { NextFunction, Request, Response } from "express";
import { createDocument } from "zod-openapi";
import { RouteImpl } from "./route.js";

export interface RouterOptions {
	basePath: string;
	middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>;
	routes: Array<RouteImpl>;
	subRouters?: Array<RouterImpl>;
}

export class RouterImpl {
	private static allRouters: RouterImpl[] = []; // <- keep track of all router instances for openapi generation

	basePath: string;
	middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
	routes: Array<RouteImpl>;
	subRouters: Array<RouterImpl>;

	constructor(options: RouterOptions) {
		this.basePath = options.basePath;
		this.middleware = options.middleware || [];
		this.routes = options.routes;
		this.subRouters = options.subRouters || [];

		RouterImpl.allRouters.push(this);
	}

	public static buildOpenApiSpec() {}
}

export const Router = (options: RouterOptions) => {
	return new RouterImpl(options);
};
