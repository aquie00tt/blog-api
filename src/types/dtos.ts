import { IUser } from "../database/models/UserModel";
import { ITokenResponse } from "./response";

/**
 * RegisterDTO type is derived from IUser by omitting certain fields
 * that are not required during registration, such as:
 * - about
 * - avatar
 * - total_follower
 * - total_following
 * - role
 * - permissions
 * - pronouns
 * - email_verified
 */
export type RegisterDTO = Omit<
	IUser,
	| "about"
	| "avatar"
	| "total_follower"
	| "total_following"
	| "role"
	| "permissions"
	| "pronouns"
	| "email_verified"
>;

/**
 * LoginDTO type is derived from RegisterDTO by omitting the
 * full_name field, which is not required for login.
 */
export type LoginDTO = Omit<RegisterDTO, "full_name">;

/**
 * RefreshTokenDTO type is derived from ITokenResponse by omitting
 * fields that are not necessary for refresh token requests,
 * such as:
 * - message
 * - status
 * - access_token
 * - expires_in
 */
export type RefreshTokenDTO = Omit<
	ITokenResponse,
	"message" | "status" | "access_token" | "expires_in"
>;
