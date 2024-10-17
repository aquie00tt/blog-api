import mongoose from "mongoose"; // Import mongoose for ObjectId and model interaction
import RefreshTokenModel, {
	IRefreshToken,
	IRefreshTokenDocument,
} from "../database/models/RefreshTokenModel"; // Import the refresh token model and interfaces
import logger from "../utils/logger"; // Import the logger for error handling

/**
 * Controller class for managing refresh tokens.
 * This class provides methods to create, revoke, and find refresh tokens.
 */
export default class RefreshTokenController {
	/**
	 * Revokes all refresh tokens for a specific user based on their user agent.
	 * This is useful for logging out users from specific devices or sessions.
	 *
	 * @param userId - The unique identifier of the user whose tokens are to be revoked.
	 * @param userAgent - The user agent string of the client requesting the revocation.
	 * @returns A promise that resolves to true if tokens were deleted, otherwise false.
	 */
	public static async revokeUserRefreshTokensByUserAgent(
		userId: mongoose.Types.ObjectId, // Explicitly using mongoose ObjectId type for the user ID
		userAgent: string, // The user agent string to match the tokens for revocation
	): Promise<boolean> {
		try {
			// Delete all refresh tokens associated with the given user ID and user agent
			const result = await RefreshTokenModel.deleteMany({
				$or: [{ userId }, { userAgent }], // Match either userId or userAgent
			});
			return result.deletedCount > 0; // Return true if at least one token was deleted
		} catch (err) {
			// Log an error if the operation fails, including userId and userAgent for context
			logger.error(
				`Error revoking tokens for userId: ${userId.toString()} and userAgent: ${userAgent}`,
				err, // Include the error object for debugging
			);
			return false; // Return false to indicate failure
		}
	}

	/**
	 * Creates a new refresh token and saves it to the database.
	 *
	 * @param refreshToken - The refresh token object to be created.
	 * @returns A promise that resolves to the created refresh token document or null if creation fails.
	 */
	public static async createRefreshToken(
		refreshToken: IRefreshToken, // The refresh token data to be stored
	): Promise<IRefreshTokenDocument | null> {
		try {
			// Create a new instance of the RefreshTokenModel with the provided refresh token data
			const newRefreshToken = new RefreshTokenModel(
				refreshToken,
			);
			// Save the new refresh token to the database
			await newRefreshToken.save();
			return newRefreshToken; // Return the saved refresh token document
		} catch (err) {
			// Log an error if the creation fails, capturing the error message
			logger.error(
				`Refresh Token Create Failed: ${(err as Error).message}`,
			);
			return null; // Return null to indicate failure
		}
	}

	/**
	 * Finds a refresh token in the database by its token value and user agent.
	 *
	 * @param token - The refresh token string to search for.
	 * @param userAgent - The user agent string to ensure the token matches the client's request.
	 * @returns A promise that resolves to the found refresh token document or null if not found.
	 */
	public static async findRefreshToken(
		token: string, // The refresh token to search for in the database
		userAgent: string, // The user agent string to validate the request
	): Promise<IRefreshTokenDocument | null> {
		try {
			// Search for a refresh token document that matches both the token and user agent
			const refreshToken =
				await RefreshTokenModel.findOne<IRefreshTokenDocument>(
					{
						refreshToken: token, // Filter by refresh token
						userAgent, // Filter by user agent
					},
				);

			return refreshToken; // Return the found refresh token document
		} catch {
			// Return null if an error occurs during the search
			return null; // Indicate failure in finding the token
		}
	}
}
