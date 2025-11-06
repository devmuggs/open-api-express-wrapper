export const HttpMethod = {
	Get: "get",
	Post: "post",
	Put: "put",
	Patch: "patch",
	Delete: "delete",
	Options: "options",
	Head: "head"
} as const;
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const ResponseContentType = {
	ApplicationJson: "application/json",
	ApplicationXml: "application/xml",
	TextPlain: "text/plain"
} as const;
export type ResponseContentType = (typeof ResponseContentType)[keyof typeof ResponseContentType];

export const RequestDataLocation = {
	Query: "query",
	Body: "body",
	Params: "params",
	Headers: "headers"
} as const;
export type RequestDataLocation = (typeof RequestDataLocation)[keyof typeof RequestDataLocation];

export const HttpStatusCode = {
	Ok: 200,
	Created: 201,
	NoContent: 204,
	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	NotFound: 404,
	InternalServerError: 500
} as const;
export type HttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

export interface OpenApiResponse<T> {
	description: string;
	content: Partial<Record<ResponseContentType, { schema: T }>>;
}

export interface OpenApiPath {
	summary?: string;
	description?: string;
	responses: Partial<Record<HttpStatusCode, OpenApiResponse<any>>>;
}

export interface OpenApiDocument {
	openapi: string;
	info: {
		title: string;
		version: string;
		description?: string;
	};
	paths: Record<string, Partial<Record<HttpMethod, OpenApiPath>>>;
}
