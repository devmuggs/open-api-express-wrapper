import { RouteHandlerImpl } from "./router-handler.js";
import { HttpMethod } from "./types.js";

export interface RouteOptions {
	handlers: Partial<Record<HttpMethod, RouteHandlerImpl<any, any>>>;
}

export class RouteImpl {
	path: string;
	handlers: Partial<Record<HttpMethod, RouteHandlerImpl<any, any>>>;

	constructor(path: string, options: RouteOptions) {
		this.path = path;
		this.handlers = options.handlers;
	}
}

export const Route = (path: string, options: RouteOptions) => {
	return new RouteImpl(path, options);
};
