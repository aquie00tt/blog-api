import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { connect, disconnect } from "../src/database/index";
import type { RegisterDTO } from "../src/types/dtos";
import UserController from "../src/controllers/UserController";
import { ITokenResponse } from "../src/types/response";

const testUser: RegisterDTO = {
	email: "testuser@gmail.com",
	password: "testuser123?",
	full_name: "Test User",
};

describe("Auth Routes", () => {
	beforeAll(async () => {
		const { email } = testUser;
		await connect();

		const exitingUser =
			await UserController.findByUserEmail(email);

		if (exitingUser) {
			await UserController.deleteByUserEmail(email);
		}
	});

	afterAll(async () => {
		await disconnect();
	});

	test("POST /api/v1/auth/register", async () => {
		const response = await request(app)
			.post("/api/v1/auth/register")
			.send(testUser);
		expect(response.statusCode).toBe(201);
		expect(response.body).toBeDefined();
	});

	test("POST /api/v1/auth/login", async () => {
		const response = await request(app)
			.post("/api/v1/auth/login")
			.set("User-Agent", "Jest")
			.send(testUser);

		expect(response.statusCode).toBe(201);
		expect(response.body).toBeDefined();
	});

	test("POST /api/v1/auth/refresh-token", async () => {
		const loginResponse = await request(app)
			.post("/api/v1/auth/login")
			.set("User-Agent", "Jest")
			.send(testUser);

		const { access_token, refresh_token }: ITokenResponse =
			loginResponse.body as ITokenResponse;

		const response = await request(app)
			.post("/api/v1/auth/refresh-token")
			.set("User-Agent", "Jest")
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				refresh_token,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toBeDefined();
	});
});
