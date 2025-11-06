import z from "zod";

import { Handler, HttpMethod, HttpStatusCode, I18n, Route, Router } from "../../src/index.js";

import { app } from "./user-registry.js";
import {
	UserCreateSchema,
	UserListParamsSchema,
	UserListSchema,
	UserSchema
} from "./user-schemas.js";

const userService: any = {};

const userRouter = Router({
	basePath: "/users", // <- prepended to all routes
	middleware: [], // <- applied to all routes
	routes: [
		Route("/", {
			handlers: {
				[HttpMethod.Get]: Handler({
					summary: I18n().en("List all users").ja("すべてのユーザーを一覧表示"),
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
							description: I18n().en("A list of users").ja("ユーザーのリスト"),
							schema: UserListSchema
						}
					}
				}),
				post: Handler({
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
				[HttpMethod.Get]: Handler({
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
							id: z.uuid().meta({ description: "Unique identifier for the user" })
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

userRouter.registerRoutes(app);
