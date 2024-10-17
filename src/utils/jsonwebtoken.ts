import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for token handling
import configuration from "./configuration"; // Import configuration settings
import logger from "./logger"; // Import the logger for logging errors
import {
	ITokenResult,
	IPayload,
	IRefreshTokenResult,
} from "../types/jsonwebtoken"; // Import type definitions for tokens and payloads

/**
 * Generates an access token based on the provided payload.
 * @param payload - The payload to be included in the token.
 * @returns An object containing the access token and its expiration time, or null if an error occurs.
 */
export function generateAccessToken(
	payload: IPayload,
): ITokenResult | null {
	try {
		// Sign the payload to generate the access token
		const token = jwt.sign(
			payload,
			configuration.SECRET_KEY, // Use the secret key from configuration
			{
				expiresIn: configuration.EXPIRES_IN, // Set the expiration time
			},
		);

		// Return the access token and its expiration time
		return {
			accessToken: token,
			expiresIn: configuration.EXPIRES_IN,
		};
	} catch (err) {
		// Log the error if token generation fails
		logger.error(
			`Generate Token Failed: ${(err as Error).message}`,
		);
		return null; // Return null if an error occurs
	}
}

/**
 * Generates a refresh token based on the provided payload.
 * @param payload - The payload to be included in the token.
 * @returns An object containing the refresh token, or null if an error occurs.
 */
export function generateRefreshToken(
	payload: IPayload,
): IRefreshTokenResult | null {
	try {
		// Sign the payload to generate the refresh token
		const token = jwt.sign(
			payload,
			configuration.REFRESH_TOKEN_SECRET_KEY, // Use the refresh token secret key from configuration
			{
				expiresIn: configuration.REFRESH_TOKEN_EXPIRES_IN, // Set the expiration time for the refresh token
			},
		);

		// Return the refresh token
		return {
			refreshToken: token,
		};
	} catch (err) {
		// Log the error if refresh token generation fails
		logger.error(
			`Generate Refresh Token Failed: ${(err as Error).message}`,
		);
		return null; // Return null if an error occurs
	}
}

/**
 * Verifies a token using the provided secret key.
 * @param token - The token to be verified.
 * @param secret_key - The secret key used to verify the token.
 * @returns The decoded payload if the token is valid, or null if an error occurs.
 */
export function verifyToken(
	token: string,
	secret_key: string,
): IPayload | null {
	try {
		// Verify the token and decode its payload
		const decodedToken = jwt.verify(token, secret_key);
		return decodedToken as IPayload; // Cast the decoded token to IPayload type
	} catch (err) {
		// Log any errors encountered during token verification
		logger.error(
			`Verify Token Failed: ${(err as Error).message}`,
		);
		return null; // Return null in case of error
	}
}

/**
 * Verifies an access token using the application's secret key.
 * @param token - The access token to be verified.
 * @returns The decoded payload if the token is valid, or null if an error occurs.
 */
export function verifyAccessToken(
	token: string,
): IPayload | null {
	return verifyToken(token, configuration.SECRET_KEY); // Call verifyToken with the access token and secret key
}

/**
 * Verifies a refresh token using the application's refresh token secret key.
 * @param token - The refresh token to be verified.
 * @returns The decoded payload if the token is valid, or null if an error occurs.
 */
export function verifyRefreshToken(
	token: string,
): IPayload | null {
	return verifyToken(
		token,
		configuration.REFRESH_TOKEN_SECRET_KEY, // Call verifyToken with the refresh token and secret key
	);
}
