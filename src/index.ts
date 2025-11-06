// example

import z from "zod";
import { I18n } from "./i18n.js";
import { Route } from "./route.js";
import { RouteHandler } from "./router-handler.js";
import { Router } from "./router.js";
import { HttpMethod, HttpStatusCode } from "./types.js";

const UserSchema = z.object({
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

const UserListSchema = z.array(UserSchema.pick({ id: true, name: true, email: true }));
const UserCreateSchema = UserSchema.omit({ id: true, joinedAt: true });
const UserUpdateSchema = UserCreateSchema.partial();

const UserListParamsSchema = z.object({
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

const userService: any = {};

const userRouter = Router({
	basePath: "/users", // <- prepended to all routes
	middleware: [], // <- applied to all routes
	routes: [
		Route("/", {
			handlers: {
				[HttpMethod.Get]: RouteHandler({
					summary: I18n().en("List all users").ja("すべてのユーザーを一覧表示"), // <- example of i18n usage
					description: I18n()
						.en("Retrieve a list of all users with pagination support")
						.ja("ページネーション対応で全ユーザーのリストを取得"),
					middleware: [
						async ({ next }) => {
							console.debug("Middleware for listing users");
							next();
						}
					],
					handler: async (req, res) => {
						const { limit, offset } = req.query;
						const users = (await userService.fetchMany({ limit, offset })) as z.infer<
							typeof UserListSchema
						>;

						return [HttpStatusCode.Ok, users];
					},
					request: {
						query: UserListParamsSchema
					},
					responses: {
						[HttpStatusCode.Ok]: {
							description: I18n().en("A list of users").ja("ユーザーのリスト"), // <- example of i18n usage
							schema: UserListSchema
						}
					}
				}),
				post: RouteHandler({
					summary: I18n().en("Create a new user").ja("新しいユーザーを作成"),
					description: I18n()
						.en("Create a new user in the system")
						.ja("システムに新しいユーザーを作成します"),
					middleware: [],
					handler: async (req, res) => {
						const userData = req.body;
						const newUser = (await userService.create(userData)) as z.infer<
							typeof UserSchema
						>;

						return [HttpStatusCode.Created, newUser];
					},
					request: {
						body: UserCreateSchema
					},
					responses: {
						[HttpStatusCode.Created]: {
							description: I18n().en("The created user").ja("作成されたユーザー"),
							schema: UserSchema
						}
					}
				})
			}
		}),

		Route("/:id", {
			handlers: {
				[HttpMethod.Get]: RouteHandler({
					summary: I18n().en("Get user by ID").ja("IDでユーザーを取得"),
					description: I18n()
						.en("Retrieve a user's details by their unique ID")
						.ja("ユーザーの一意のIDで詳細を取得します"),
					middleware: [],
					handler: async (req, res) => {
						const userId = req.params.id;
						const user = (await userService.fetchById(userId)) as z.infer<
							typeof UserSchema
						>;

						return [HttpStatusCode.Ok, user];
					},
					request: {
						params: z.object({
							id: z
								.string()
								.uuid()
								.meta({ description: "Unique identifier for the user" })
						})
					},
					responses: {
						[HttpStatusCode.Ok]: {
							description: I18n().en("The user details").ja("ユーザーの詳細"),
							schema: UserSchema
						},
						[HttpStatusCode.NotFound]: {
							description: I18n().en("User not found").ja("ユーザーが見つかりません")
						}
					}
				})
			}
		})
	]
});
