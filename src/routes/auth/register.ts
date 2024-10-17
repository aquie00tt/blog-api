import type {
	Request,
	Response,
	NextFunction,
} from "express"; // Import types from Express for type safety in request, response, and next function
import { RegisterDTO } from "../../types/dtos"; // Import the Register Data Transfer Object for type checking
import BadRequestError from "../../errors/BadRequestError"; // Custom error for handling bad requests
import UserController from "../../controllers/UserController"; // Import the UserController to handle user-related operations
import ServerFailedError from "../../errors/ServerFailedError"; // Custom error for handling server errors
import {
	IErrorResponse,
	IMessageResponse,
} from "../../types/response"; // Import response types for consistent API responses
import { hashPassword } from "../../utils/password"; // Utility function for hashing passwords
import mongoose from "mongoose"; // Import mongoose to access the ValidationError

/**
 * Registers a new user in the system.
 *
 * @param req - The request object containing user registration data.
 * @param res - The response object for sending responses back to the client.
 * @param next - The next middleware function in the stack.
 * @returns A promise that resolves to either void, an error response, or a success message.
 */
export default async function register(
	req: Request<object, object, RegisterDTO>, // Type the request to include RegisterDTO
	res: Response, // Type the response
	next: NextFunction, // Type the next function
): Promise<
	void | IErrorResponse | Response<IMessageResponse>
> {
	// Destructure required fields from the request body
	const { email, password, full_name } = req.body;

	// Validate required fields
	if (!email || !password || !full_name) {
		return next(
			new BadRequestError(
				"Email, password, and full name are required fields", // Provide detailed error message
			),
		);
	}

	try {
		// Check if the user already exists
		const existingUser =
			await UserController.findByUserEmail(email);

		if (existingUser) {
			return next(
				new BadRequestError("User is already registered"), // Return error if user exists
			);
		}

		// Hash the provided password for security
		const hashedPassword = await hashPassword(password);

		if (!hashedPassword) {
			return next(
				new ServerFailedError("Hashing password failed"), // Handle hashing errors
			);
		}

		// Create a new user in the database
		await UserController.createUser({
			email,
			password: hashedPassword, // Store the hashed password
			full_name,
		});

		// Send a success response
		return res.status(201).json({
			message: "Created a user successfully", // Success message
			status: "success", // Status of the response
		} as IMessageResponse);
	} catch (err) {
		// Check if the error is a Mongoose validation error
		if (err instanceof mongoose.Error.ValidationError) {
			return next(
				new BadRequestError((err as Error).message), // Provide the validation error message
			);
		}
		// Handle other types of server errors
		return next(
			new ServerFailedError((err as Error).message), // Provide the server error message
		);
	}
}
