import type { IUserDocument } from "../database/models/UserModel"; // Import the IUserDocument interface for user documents
import UserModel from "../database/models/UserModel"; // Import the Mongoose model for user
import type { RegisterDTO } from "../types/dtos"; // Import the RegisterDTO for user registration data transfer object

/**
 * UserController class is responsible for handling user-related operations
 */
class UserController {
	/**
	 * Creates a new user in the database.
	 * @param user - The user registration data to be saved.
	 * @returns A promise that resolves to the created user document.
	 */
	public static async createUser(
		user: RegisterDTO,
	): Promise<IUserDocument> {
		const newUser = new UserModel(user); // Create a new instance of UserModel with the provided user data
		await newUser.save(); // Save the new user to the database
		return newUser; // Return the created user document
	}

	/**
	 * Finds a user by their email address.
	 * @param email - The email address of the user to find.
	 * @returns A promise that resolves to the user document if found, otherwise null.
	 */
	public static async findByUserEmail(
		email: string,
	): Promise<IUserDocument | null> {
		const user = await UserModel.findOne<IUserDocument>({
			email,
		}); // Query the database for a user with the specified email
		return user; // Return the found user or null if not found
	}

	/**
	 * Deletes a user from the database by their email address.
	 * @param email - The email address of the user to delete.
	 * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
	 */
	public static async deleteByUserEmail(
		email: string,
	): Promise<boolean> {
		const deleteResult = await UserModel.deleteOne({
			email,
		}); // Attempt to delete the user by their email address

		return deleteResult.deletedCount > 0; // Return true if a user was deleted, otherwise false
	}
}

export default UserController; // Export the UserController class for use in other modules
