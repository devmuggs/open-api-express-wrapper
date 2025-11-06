import z from "zod";

export const UserSchema = z.object({
	id: z.uuid().meta({
		readOnly: true,
		description: "Unique identifier for the user",
		example: "123e4567-e89b-12d3-a456-426614174000",
		id: "user-id"
	}),
	name: z.string().meta({ description: "Full name of the user", example: "John Doe" }),
	username: z.string().meta({ description: "Username of the user", example: "johndoe" }),
	email: z
		.email()
		.meta({ description: "Email address of the user", example: "johndoe@example.com" }),

	dateOfBirth: z.iso
		.date()
		.meta({ description: "Date of birth of the user", example: "1990-01-01" }),
	joinedAt: z.iso.date().meta({ description: "Date when the user joined", example: "2020-01-01" })
});

export const UserListSchema = z.array(UserSchema.pick({ id: true, name: true, email: true }));
export const UserCreateSchema = UserSchema.omit({ id: true, joinedAt: true });
export const UserUpdateSchema = UserCreateSchema.partial();

export const UserListParamsSchema = z.object({
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(10)
		.meta({ description: "Maximum number of users to return" }),
	offset: z
		.number()
		.min(0)
		.default(0)
		.meta({ description: "Number of users to skip before starting to collect the result set" })
});
