import type {
	Request,
	Response,
	NextFunction,
} from "express"; // Import types for Express Request, Response, and NextFunction
import type { RefreshTokenDTO } from "../../types/dtos"; // Import the DTO for refresh token data transfer object
import BadRequestError from "../../errors/BadRequestError"; // Import custom error class for bad requests
import {
	generateAccessToken,
	verifyRefreshToken,
} from "../../utils/jsonwebtoken"; // Import utility functions for token generation and verification
import RefreshTokenController from "../../controllers/RefreshTokenController"; // Import the controller for managing refresh tokens
import ServerFailedError from "../../errors/ServerFailedError"; // Import custom error class for server errors
import type { RefreshTokenResponse } from "../../types/response"; // Import response type for refresh token responses

/**
 * Middleware function to handle refreshing access tokens using refresh tokens.
 *
 * @param req - The HTTP request object, containing the refresh token in the body.
 * @param res - The HTTP response object for sending responses back to the client.
 * @param next - The next middleware function to call in case of errors.
 * @returns A response containing the new access token or an error if the refresh fails.
 */
export async function refreshToken(
	req: Request<object, object, RefreshTokenDTO>, // Define request type with DTO for refresh token
	res: Response, // Define response type
	next: NextFunction, // Define next function for error handling
): Promise<Response<RefreshTokenResponse> | void> {
	const { refresh_token } = req.body; // Destructure the refresh token from the request body

	// Check if the refresh token is provided in the request body
	if (!refresh_token) {
		return next(
			new BadRequestError("refresh_token required field."), // Call next with an error if missing
		);
	}

	// Verify the provided refresh token
	const verifiedToken = verifyRefreshToken(refresh_token);

	// Check if the token verification failed
	if (!verifiedToken) {
		return next(
			new BadRequestError("Invalid refresh token."), // Call next with an error if the token is invalid
		);
	}

	const userAgent = req.headers["user-agent"]; // Get the user agent from the request headers

	// Check if the user agent is present in the headers
	if (!userAgent) {
		return next(new BadRequestError("user agent missing")); // Call next with an error if missing
	}

	// Attempting to find the refresh token in the database using the controller
	const foundToken =
		await RefreshTokenController.findRefreshToken(
			refresh_token,
			userAgent,
		);

	// Check if the refresh token was found in the database
	if (!foundToken) {
		return next(
			new BadRequestError("Invalid refresh token."), // Return an error if the token is not valid
		);
	}

	// Generate a new access token using the user information from the request
	const accessTokenResult = generateAccessToken({
		id: req.user.id,
		full_name: req.user.full_name,
		permissions: req.user.permissions,
		role: req.user.role,
	});

	// Checking if the access token generation was successful
	if (!accessTokenResult) {
		return next(
			new ServerFailedError("Failed to generate token."), // Return an error if token generation failed
		);
	}

	// Construct the response object with the newly created access token
	const response: RefreshTokenResponse = {
		message: "Created a access token", // Success message
		status: "success", // Status indicating the request was successful
		access_token: accessTokenResult.accessToken, // Newly generated access token
		expires_in: accessTokenResult.expiresIn, // Expiry time for the access token
	};

	return res.status(201).json(response); // Send the response back to the client with a 201 status
}
