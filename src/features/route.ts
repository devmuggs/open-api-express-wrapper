import { HandlerImpl, HttpMethod } from "../index.js";

export interface RouteOptions {
	handlers: Partial<Record<HttpMethod, HandlerImpl<any, any>>>;
}

export class RouteImpl {
	path: string;
	handlers: Partial<Record<HttpMethod, HandlerImpl<any, any>>>;

	constructor(path: string, options: RouteOptions) {
		this.path = path;
		this.handlers = options.handlers;
	}
}

export const Route = (path: string, options: RouteOptions) => {
	return new RouteImpl(path, options);
};
