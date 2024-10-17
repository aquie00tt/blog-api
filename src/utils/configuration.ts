import { config } from "dotenv";

// Load environment variables from the appropriate .env file based on NODE_ENV.
config({ path: `.env.${process.env.NODE_ENV}` });

/**
 * Custom error class for missing environment variables.
 */
class MissingVariableError extends Error {
	constructor(variable: string) {
		super(
			`${variable} is not defined. Please add it to your .env.${process.env.NODE_ENV} file.`,
		);
		this.name = "MissingVariableError"; // Set the name of the error to 'MissingVariableError'.
	}
}

/**
 * Custom error class for invalid number type environment variables.
 */
class NotNumberError extends Error {
	constructor(variable: string) {
		super(`${variable} must be a valid number.`);
		this.name = "NotNumberError"; // Set the name of the error to 'NotNumberError'.
	}
}

// List of required environment variables
const requiredVariables = [
	"PORT",
	"ALLOW_LIST",
	"API_VERSION",
	"MONGO_CONNECTION_URI",
	"MONGO_DATABASE_NAME",
	"SALT_ROUNDS",
	"SECRET_KEY",
	"EXPIRES_IN",
	"REFRESH_TOKEN_SECRET_KEY",
	"REFRESH_TOKEN_EXPIRES_IN",
];

// Check for missing variables and throw an error if any are missing
requiredVariables.forEach((variable) => {
	if (!process.env[variable]) {
		throw new MissingVariableError(variable); // Throw an error if the variable is not defined.
	}
});

// Validate and convert environment variables to the correct types
const port = Number(process.env.PORT);
if (isNaN(port)) throw new NotNumberError("PORT"); // Check if PORT is a valid number.

const allowArray = process.env.ALLOW_LIST.split(","); // Split ALLOW_LIST into an array.

const apiVersion = Number(process.env.API_VERSION);
if (isNaN(apiVersion))
	throw new NotNumberError("API_VERSION"); // Check if API_VERSION is a valid number.

const saltRounds = Number(process.env.SALT_ROUNDS);
if (isNaN(saltRounds))
	throw new NotNumberError("SALT_ROUNDS"); // Check if SALT_ROUNDS is a valid number.

const expiresIn = Number(process.env.EXPIRES_IN);
if (isNaN(expiresIn))
	throw new NotNumberError("EXPIRES_IN"); // Check if EXPIRES_IN is a valid number.

const refreshTokenExpiresIn = Number(
	process.env.REFRESH_TOKEN_EXPIRES_IN,
);
if (isNaN(refreshTokenExpiresIn))
	throw new NotNumberError("REFRESH_TOKEN_EXPIRES_IN"); // Check if REFRESH_TOKEN_EXPIRES_IN is a valid number.

// Configuration object
const configuration = {
	NODE_ENV: process.env.NODE_ENV, // The current environment (development, test, production).
	PORT: port, // The port number for the server.
	ALLOW_LIST: allowArray, // List of allowed origins for CORS.
	API_VERSION: apiVersion, // The API version.
	MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI, // URI for MongoDB connection.
	MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME, // Name of the MongoDB database.
	SALT_ROUNDS: saltRounds, // Number of salt rounds for bcrypt.
	SECRET_KEY: process.env.SECRET_KEY, // Secret key for JWT or other purposes.
	EXPIRES_IN: expiresIn, // Expiration time for tokens.
	REFRESH_TOKEN_SECRET_KEY:
		process.env.REFRESH_TOKEN_SECRET_KEY, // Secret key for refresh tokens.
	REFRESH_TOKEN_EXPIRES_IN: refreshTokenExpiresIn, // Expiration time for refresh tokens.
};

// Export the configuration object for use throughout the application.
export default configuration;
