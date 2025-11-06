# @muggridge/open-api

Utilities for TypeScript to automate the generation of Open API (Swagger) documentation without sacrificing the flexibility of Express JS framework.

## Core Tenets

- **Minimal Intrusion**: Designed to easily integrate with existing Express JS applications with minimal code changes.
- **TypeScript First**: Leverages TypeScript's type system to ensure type safety and consistency between your code and API documentation.
- **Flexibility**: Allows developers to define routes and middleware in a way that feels natural, without being constrained by rigid frameworks.
- **Automated Documentation**: Automatically generates Open API documentation based on your TypeScript types and Express routes, reducing manual effort and potential errors.
- **Extensibility**: Provides hooks and options to customize the generated documentation to fit specific project needs.
- **Community Driven**: Open source and encourages contributions to enhance functionality and address diverse use cases.
- **Lightweight**: Designed to have a minimal footprint, ensuring that it does not add unnecessary complexity to your application.
- **Don't Reinvent the Wheel**: Focuses on enhancing existing Express JS capabilities rather than replacing them, allowing developers to continue using familiar patterns and libraries.

## Dependencies

- **Express**: The web framework for Node.js that is required for building the API.
- **TypeScript**: The language in which the code is written, providing type safety and modern JavaScript features.
- **Zod**: A TypeScript-first schema declaration and validation library used for defining request and response schemas.
- **Zod OpenApi**: A library that extends Zod to generate OpenAPI specifications from Zod schemas.

## Example Output

```json
{
	"openapi": "3.0.0",
	"info": {
		"title": "My API",
		"version": "1.0.0"
	},
	"paths": {
		"/users": {
			"get": {
				"summary": "Get all users",
				"responses": {
					"200": {
						"description": "A list of users",
						"content": {
							"application/json": {
								"schema": {
									"type": "array",
									"items": {
										"$ref": "#/components/schemas/User"
									}
								}
							}
						}
					}
				}
			}
		}
	},
	"components": {
		"schemas": {
			"User": {
				"type": "object",
				"properties": {
					"id": {
						"type": "string"
					},
					"name": {
						"type": "string"
					},
					"email": {
						"type": "string",
						"format": "email"
					}
				},
				"required": ["id", "name", "email"]
			}
		}
	}
}
```
