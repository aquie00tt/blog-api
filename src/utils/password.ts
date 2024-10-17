import bcrypt from "bcryptjs";
import configuration from "./configuration";
import logger from "./logger";

/**
 * Hashes a plain text password using bcrypt with a configurable number of salt rounds.
 * The hashed password is stored securely to protect against unauthorized access.
 *
 * @param password - The plain text password that needs to be hashed.
 * @param saltRounds - Number of rounds for generating the salt (default from configuration).
 * @returns A promise that resolves to the hashed password string, or null if an error occurs.
 */
export async function hashPassword(
	password: string,
	saltRounds = configuration.SALT_ROUNDS, // Default value from configuration
): Promise<string | null> {
	try {
		// Hash the password using bcrypt and the provided salt rounds
		const hashedPassword = await bcrypt.hash(
			password,
			saltRounds,
		);
		return hashedPassword; // Return the hashed password
	} catch (err) {
		// Log the error if hashing fails
		logger.error(
			`Error hashing password: ${(err as Error).message}`,
		);
		return null; // Return null in case of error
	}
}

/**
 * Compares a plain text password with a hashed password to verify user credentials.
 * This is used to authenticate a user during login or similar operations.
 *
 * @param password - The plain text password provided by the user.
 * @param hashedPassword - The previously stored hashed password for comparison.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export async function comparePassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	try {
		// Compare the plain text password with the stored hashed password
		const isMatch = await bcrypt.compare(
			password,
			hashedPassword,
		);
		return isMatch; // Return true if passwords match, false otherwise
	} catch (err) {
		// Log the error if the comparison fails
		logger.error(
			`Error comparing password: ${(err as Error).message}`,
		);
		return false; // Return false in case of error
	}
}
