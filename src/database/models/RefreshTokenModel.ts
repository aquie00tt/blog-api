import { Document, Schema, model } from "mongoose";
import { IUserDocument } from "./UserModel";

/**
 * IRefreshToken interface defines the structure of the refresh token object.
 * It includes a reference to the user, the refresh token string, expiration date, and user agent.
 */
export interface IRefreshToken {
	userId: IUserDocument["_id"]; // Reference to the user's _id
	refreshToken: string; // The actual refresh token string
	expiresAt: Date; // The expiration date and time of the refresh token
	userAgent: string; // The user agent string of the client
}

/**
 * IRefreshTokenDocument interface extends the IRefreshToken and Mongoose's Document interface.
 * It includes an additional createdAt field for tracking when the refresh token document was created.
 */
export interface IRefreshTokenDocument
	extends Document,
		IRefreshToken {
	createdAt: Date; // Timestamp when the document was created
}

/**
 * Defines the schema for the Refresh Token collection in MongoDB.
 * The schema outlines the structure of each refresh token document.
 */
const refreshTokenSchema =
	new Schema<IRefreshTokenDocument>(
		{
			userId: {
				type: Schema.Types.ObjectId, // Mongoose ObjectId referencing the User model
				ref: "User", // Reference to the User model
				required: true, // The userId field is required
			},
			refreshToken: {
				type: String, // The refresh token string
				required: true, // The refreshToken field is required
			},
			userAgent: {
				type: String, // The user agent associated with the token
				required: true, // The userAgent field is required
				unique: true, // Enforce uniqueness on the user agent
			},
			expiresAt: {
				type: Date, // The expiration date and time of the token
				required: true, // The expiresAt field is required
			},
			createdAt: {
				type: Date, // The timestamp for when the document was created
				default: Date.now, // Automatically set the creation date to the current time
			},
		},
		{
			timestamps: false, // Disable automatic createdAt and updatedAt fields
		},
	);

/**
 * Create an index on the expiresAt field to automatically remove expired tokens from the collection.
 * Documents will be automatically deleted after the expiresAt time has passed.
 */
refreshTokenSchema.index(
	{ expiresAt: 1 },
	{ expireAfterSeconds: 0 }, // Documents will expire at the exact time specified by expiresAt
);

/**
 * Create and export the RefreshToken model based on the refreshTokenSchema.
 * This model allows interaction with the "refresh_tokens" collection in MongoDB.
 */
const RefreshTokenModel = model<IRefreshTokenDocument>(
	"RefreshToken", // Name of the model
	refreshTokenSchema, // Schema defining the model
	"refresh_tokens", // Name of the collection in the database
);

export default RefreshTokenModel; // Export the model for use in other parts of the application
