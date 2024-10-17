import BaseError from "./BaseError";

/**
 * BadRequestError is a custom error class that extends the BaseError class.
 * It represents an HTTP 400 Bad Request error, which is typically used when the server
 * cannot process the request due to client-side input errors (e.g., invalid data).
 */
export default class BadRequestError extends BaseError {
	/**
	 * Constructs a new BadRequestError instance.
	 * @param message - Optional. The error message to be shown. Defaults to "Bad Request".
	 */
	public constructor(message = "Bad Request") {
		// Calls the BaseError constructor with the custom message and status code 400.
		super(message, 400);
	}
}
