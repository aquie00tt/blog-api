import type {
	Request,
	Response,
	NextFunction,
} from "express"; // Importing types from Express for request, response, and next function
import { verifyAccessToken } from "../utils/jsonwebtoken"; // Importing utility function for token verification
import UnauthorizedError from "../errors/UnauthorizedError";

/**
 * Middleware function to authenticate users based on the provided authorization token.
 * @param req - The request object containing user information.
 * @param _res - The response object for sending responses to the client.
 * @param next - The next middleware function in the stack.
 */
export default function authentication(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	// Retrieve the Authorization header from the request
	const authHeader = req.headers.authorization;

	// Check if the Authorization header is missing
	if (!authHeader) {
		return next(
			new UnauthorizedError(
				"Authorization header is missing.", // Error message indicating the absence of the header
			),
		);
	}

	// Extract the token from the Authorization header (assuming format is "Bearer <token>")
	const token = authHeader.split(" ")[1];

	// Check if the token is missing
	if (!token) {
		return next(new UnauthorizedError("Token is missing.")); // Error message for missing token
	}

	// Verify the token using the utility function
	const decodedToken = verifyAccessToken(token);

	// Check if the token verification was unsuccessful
	if (!decodedToken) {
		return next(new UnauthorizedError("Token is invalid.")); // Return an error if the token is invalid
	}

	// Attach the decoded token (user information) to the request object for use in subsequent middleware
	req.user = decodedToken;

	// Call the next middleware function in the stack
	next();
}
