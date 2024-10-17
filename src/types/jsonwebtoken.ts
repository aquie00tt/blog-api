import mongoose from "mongoose";
import type {
	PermissionsBitfield,
	RoleNames,
} from "./permissions";

/**
 * IPayload interface represents the structure of the payload
 * that will be included in the JWT token. It contains:
 * - id: the unique identifier of the user as a mongoose ObjectId
 * - full_name: the full name of the user
 * - role: the role of the user as defined in RoleNames
 * - permissions: the user's permissions represented by a bitfield
 */
export interface IPayload {
	id: mongoose.Types.ObjectId;
	full_name: string;
	role: RoleNames;
	permissions: PermissionsBitfield;
}

/**
 * ITokenResult interface represents the structure of the result
 * returned upon successful generation of an access token. It contains:
 * - accessToken: the generated JWT access token
 * - expiresIn: the duration in seconds until the access token expires
 */
export interface ITokenResult {
	accessToken: string;
	expiresIn: number;
}

/**
 * IRefreshTokenResult interface represents the structure of the result
 * returned upon successful generation of a refresh token. It contains:
 * - refreshToken: the generated refresh token
 */
export interface IRefreshTokenResult {
	refreshToken: string;
}
