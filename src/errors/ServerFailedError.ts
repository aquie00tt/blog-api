import BaseError from "./BaseError";

/**
 * ServerFailedError is a custom error class that extends the BaseError class.
 * It represents an HTTP 500 Internal Server Error, typically used when the server
 * encounters an unexpected condition that prevents it from fulfilling the request.
 */
export default class ServerFailedError extends BaseError {
	/**
	 * Constructs a new ServerFailedError instance.
	 * @param message - Optional. The error message to be shown. Defaults to "Server Failed".
	 */
	public constructor(message = "Server Failed") {
		// Calls the BaseError constructor with the custom message and status code 500.
		super(message, 500);
	}
}
