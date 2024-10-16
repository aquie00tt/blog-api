import type { Status } from "./Status";

/**
 * Interface representing a successful message response.
 * This is typically used to convey information back to the client.
 */
export interface IMessageResponse {
	/**
	 * A descriptive message related to the response.
	 * This could be a success message or any relevant information.
	 */
	message: string;

	/**
	 * The status of the response, indicating success or failure.
	 * It should conform to the Status type defined elsewhere.
	 */
	status: Status;
}

/**
 * Interface representing an error response.
 * This extends IMessageResponse to include additional error-related information.
 */
export interface IErrorResponse extends IMessageResponse {
	/**
	 * Optional stack trace string for debugging purposes.
	 * This is included only in development environments to help trace errors.
	 */
	stack?: string;
}

/**
 * Interface representing a data response, which extends IMessageResponse.
 * This includes an additional data property to return requested data.
 *
 * @template T - The type of data being returned in the response.
 */
export interface IDataResponse<T> extends IMessageResponse {
	/**
	 * The data associated with the response.
	 * This could be any type of data, depending on the context.
	 */
	data: T;
}

/**
 * Interface representing a token response, which includes the access token,
 * expiration time, and refresh token.
 */
export interface ITokenResponse extends IMessageResponse {
	access_token: string; // The generated access token
	expires_in: number; // Duration in seconds until the access token expires
	refresh_token: string; // The generated refresh token
}

/**
 * Type representing a response for refreshing tokens,
 * omitting the refresh token from the token response.
 */
export type RefreshTokenResponse = Omit<
	ITokenResponse,
	"refresh_token"
>;
