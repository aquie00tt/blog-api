import { Schema, Document, model } from "mongoose";
import {
	PermissionsBitfield,
	Role,
	RoleNames,
} from "../../types/permissions";

/**
 * Enum for pronouns to ensure consistent values for gender pronouns.
 * Helps control the input for the pronouns field in the schema.
 */
export enum Pronouns {
	HE = "he",
	SHE = "she",
	THEY = "they",
	OTHER = "other",
}

/**
 * IUser interface defines the structure of a user document.
 * Includes fields for email, name, password, role, permissions, and optional pronouns.
 */
export interface IUser {
	email: string; // User's email address
	email_verified: boolean; // Indicates if the email is verified
	full_name: string; // User's full name
	password: string; // User's password
	about: string; // Short bio or description of the user
	avatar: string; // URL to the user's avatar
	total_follower: number; // Total number of followers the user has
	total_following: number; // Total number of users the user is following
	role: keyof Role; // Role is a predefined set of roles (e.g., user, admin)
	permissions: PermissionsBitfield; // Bitfield representing the user's permissions
	pronouns?: Pronouns; // Optional field for the user's pronouns
}

/**
 * IUserDocument interface represents the structure of a user document in MongoDB.
 * It extends Mongoose's Document interface for schema validation and timestamps.
 */
export interface IUserDocument extends Document, IUser {
	createdAt: Date; // Timestamp for when the user was created
	updatedAt: Date; // Timestamp for when the user was last updated
}

/**
 * Defines the Mongoose schema for the User collection.
 * Specifies the structure, validation rules, and default values for user documents.
 */
const userSchema = new Schema<IUserDocument>(
	{
		/**
		 * User's email address.
		 * Must be unique and follow a specific regex pattern for validation.
		 */
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true, // Ensures the email is unique
			match: [
				/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/, // Regex pattern for a valid email address
				"Please enter a valid email address",
			],
			minLength: [
				6,
				"Email must be at least 6 characters long",
			],
			maxLength: [
				50,
				"Email must be at most 50 characters long",
			],
		},
		/**
		 * Indicates if the user's email has been verified.
		 */
		email_verified: {
			type: Boolean,
			default: false,
		},
		/**
		 * User's full name.
		 * Requires a minimum and maximum length for validation.
		 */
		full_name: {
			type: String,
			required: [true, "Full name is required"],
			minLength: [
				2,
				"Full name must be at least 2 characters long",
			],
			maxLength: [
				100,
				"Full name must be at most 100 characters long",
			],
		},
		/**
		 * User's password.
		 * Must be at least 8 characters long and follow a strong password pattern.
		 */
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [
				8,
				"Password must be at least 8 characters long",
			],
			maxLength: [
				100,
				"Password must be at most 100 characters long",
			],
		},
		/**
		 * Optional field for a short bio or description about the user.
		 */
		about: {
			type: String,
			maxLength: [
				160,
				"About section must be at most 160 characters long",
			],
			default: "",
		},
		/**
		 * URL for the user's avatar.
		 * Default value is a link to a default avatar image.
		 */
		avatar: {
			type: String,
			default:
				"http://localhost:8080/images/default_avatar.jpeg",
		},
		/**
		 * Number of followers the user has.
		 * Defaults to 0.
		 */
		total_follower: {
			type: Number,
			default: 0,
		},
		/**
		 * Number of users the user is following.
		 * Defaults to 0.
		 */
		total_following: {
			type: Number,
			default: 0,
		},
		/**
		 * Role of the user, restricted to predefined roles.
		 * The default role is 'user'.
		 */
		role: {
			type: String,
			enum: RoleNames, // Restricts values to the RoleNames enum
			default: RoleNames.USER, // Default role is 'user'
		},
		/**
		 * Numeric representation of the user's permissions using a bitfield.
		 * Default value is set to the default permissions bitfield.
		 */
		permissions: {
			type: Number,
			default: PermissionsBitfield.DEFAULT, // Default permissions
		},
		/**
		 * Optional field for the user's preferred pronouns.
		 * Restricted to values from the Pronouns enum.
		 */
		pronouns: {
			type: String,
			enum: Object.values(Pronouns), // Restricts values to the Pronouns enum
			required: false,
		},
	},
	{
		/**
		 * Enables automatic `createdAt` and `updatedAt` timestamps for each user document.
		 */
		timestamps: true,
	},
);

/**
 * Mongoose model for the User collection based on the userSchema.
 * Interacts with the "users" collection in the database.
 */
const UserModel = model<IUserDocument>(
	"User",
	userSchema,
	"users",
);

export default UserModel; // Exports the model for use in other parts of the application
