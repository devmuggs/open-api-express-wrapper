export const ContentType = {
	ApplicationJson: "application/json",
	ApplicationXml: "application/xml",
	TextPlain: "text/plain"
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];
