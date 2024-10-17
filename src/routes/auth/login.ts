import type {
	Request,
	Response,
	NextFunction,
} from "express";
import type { LoginDTO } from "../../types/dtos"; // DTO for login request
import BadRequestError from "../../errors/BadRequestError"; // Custom error for bad requests
import UserController from "../../controllers/UserController"; // Controller to handle user logic
import { comparePassword } from "../../utils/password"; // Utility to compare hashed passwords
import {
	generateAccessToken,
	generateRefreshToken,
} from "../../utils/jsonwebtoken"; // JWT utilities for token generation
import type { IPayload } from "../../types/jsonwebtoken"; // Payload interface for JWT
import ServerFailedError from "../../errors/ServerFailedError"; // Custom error for server failures
import type { ITokenResponse } from "../../types/response"; // Response interface for token-related responses
import RefreshTokenController from "../../controllers/RefreshTokenController";
import configuration from "../../utils/configuration";

/**
 * Login function to authenticate a user, generate access and refresh tokens,
 * and return the tokens if authentication is successful.
 *
 * @param req - Express Request object, expects LoginDTO in the body
 * @param res - Express Response object
 * @param next - Express NextFunction for handling middleware
 * @returns A response with access and refresh tokens or an error
 */
export default async function login(
	req: Request<object, object, LoginDTO>,
	res: Response,
	next: NextFunction,
): Promise<Response<ITokenResponse> | void> {
	const { email, password } = req.body;

	/**
	 * Check if both email and password are provided in the request body.
	 * If not, trigger a BadRequestError.
	 */
	if (!email || !password) {
		return next(
			new BadRequestError(
				"Email and password are required fields.",
			),
		);
	}

	/**
	 * Attempt to find the user by their email address in the database.
	 * If the user is not found, return a BadRequestError.
	 */
	const existingUser =
		await UserController.findByUserEmail(email);

	if (!existingUser) {
		return next(
			new BadRequestError("The user is not registered."),
		);
	}

	/**
	 * Compare the provided password with the stored hashed password.
	 * If the password is incorrect, return a BadRequestError.
	 */
	const isValidPassword = await comparePassword(
		password,
		existingUser.password,
	);

	if (!isValidPassword) {
		return next(
			new BadRequestError("Password is incorrect."),
		);
	}

	/**
	 * Define the payload to be embedded in the JWT.
	 * The payload includes the user's role, permissions, and full name.
	 */
	const payload: IPayload = {
		id: existingUser.id,
		role: existingUser.role,
		permissions: existingUser.permissions,
		full_name: existingUser.full_name,
	};

	/**
	 * Generate an access token using the payload.
	 * If token generation fails, return a ServerFailedError.
	 */
	const accessTokenResult = generateAccessToken(payload);

	if (!accessTokenResult) {
		return next(
			new ServerFailedError(
				"Failed to generate access token.",
			),
		);
	}

	/**
	 * Generate a refresh token for the user.
	 * If refresh token generation fails, return a ServerFailedError.
	 */
	const refreshTokenResult = generateRefreshToken(payload);

	if (!refreshTokenResult) {
		return next(
			new ServerFailedError(
				"Failed to generate refresh token.",
			),
		);
	}

	if (!req.headers["user-agent"]) {
		return next(
			new BadRequestError("User-Agent header is missing"),
		);
	}
	// Revoke all existing refresh tokens for the user
	await RefreshTokenController.revokeUserRefreshTokensByUserAgent(
		existingUser.id,
		req.headers["user-agent"],
	);

	// Create a new refresh token entry in the database
	await RefreshTokenController.createRefreshToken({
		userId: existingUser._id, // User ID to associate with the refresh token
		refreshToken: refreshTokenResult.refreshToken, // The generated refresh token
		expiresAt: new Date(
			Date.now() + configuration.REFRESH_TOKEN_EXPIRES_IN, // Expiration time calculated from the configured value
		),
		userAgent: req.headers["user-agent"],
	});

	/**
	 * Create the response object to send back to the client.
	 * The response includes the access token, its expiry time, and the refresh token.
	 */
	const response: ITokenResponse = {
		message: "Login successful",
		status: "success",
		access_token: accessTokenResult.accessToken,
		expires_in: accessTokenResult.expiresIn,
		refresh_token: refreshTokenResult.refreshToken,
	};

	/**
	 * Send the response with a 201 status code, indicating a successful resource creation.
	 */
	return res.status(201).json(response);
}
