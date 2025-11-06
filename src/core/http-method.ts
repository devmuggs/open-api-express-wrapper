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
