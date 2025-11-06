export const RequestDataLocation = {
	Query: "query",
	Body: "body",
	Params: "params",
	Headers: "headers"
} as const;

export type RequestDataLocation = (typeof RequestDataLocation)[keyof typeof RequestDataLocation];
