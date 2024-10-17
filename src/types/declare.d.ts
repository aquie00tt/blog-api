import type { IPayload } from "./jsonwebtoken";

/**
 * Augmenting the global NodeJS namespace to include custom environment variable types.
 * This allows TypeScript to understand the structure of the process.env object.
 */
declare global {
	namespace NodeJS {
		/**
		 * Interface representing the environment variables available in Node.js.
		 */
		interface ProcessEnv {
			/**
			 * The current environment the application is running in:
			 * Can be 'development', 'test', or 'production'.
			 * This is used to control environment-specific behavior.
			 */
			NODE_ENV: "development" | "test" | "production";

			/**
			 * The port number on which the application will listen.
			 * Should be a string that can be converted to a number.
			 * Typically used by the server to determine which port to bind to.
			 */
			PORT: string;

			/**
			 * A comma-separated list of allowed origins for CORS (Cross-Origin Resource Sharing).
			 * Used to specify which domains are allowed to access the server's resources.
			 */
			ALLOW_LIST: string;

			/**
			 * The version of the API being used.
			 * This string indicates the version number for the API, such as '1', '2', etc.
			 */
			API_VERSION: string;

			/**
			 * The URI string used to connect to the MongoDB database.
			 * This is typically in the format 'mongodb://<host>:<port>/'.
			 */
			MONGO_CONNECTION_URI: string;

			/**
			 * The name of the MongoDB database to use.
			 * Specifies which database in the MongoDB server the application will interact with.
			 */
			MONGO_DATABASE_NAME: string;

			/**
			 * Bcryptjs SALT_ROUNDS key.
			 * Defines the number of rounds for bcrypt hashing to enhance security.
			 */
			SALT_ROUNDS: string;

			/**
			 * The secret key used for signing tokens.
			 * This key should be kept confidential and used in token generation/verification.
			 */
			SECRET_KEY: string;

			/**
			 * The expiration time for tokens.
			 * This string defines how long the generated tokens are valid before expiration.
			 */
			EXPIRES_IN: string;

			/**
			 * The secret key used specifically for refresh tokens.
			 * Like SECRET_KEY, this key should also be kept confidential.
			 */
			REFRESH_TOKEN_SECRET_KEY: string;

			/**
			 * The expiration time for refresh tokens.
			 * This string indicates how long the refresh tokens are valid before they need to be refreshed.
			 */
			REFRESH_TOKEN_EXPIRES_IN: string;
		}
	}

	namespace Express {
		// Extending the Express Request interface to include a user property of type IPayload.
		interface Request {
			user: IPayload;
		}
	}
}

/**
 * Export an empty object to make this file a module,
 * allowing for proper module augmentation in TypeScript.
 */
export {};
