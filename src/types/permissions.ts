/**
 * Enum representing the bitfield permissions for different actions
 * within the application. Each permission is assigned a unique bit position
 * for easy combination and checking.
 */
export enum PermissionsBitfield {
	DEFAULT = 1 << 0, // Default permission (1)
	MANAGE_BLOG = 1 << 1, // Permission to manage blog posts (2)
	MANAGE_USERS = 1 << 2, // Permission to manage users (4)
}

/**
 * Enum representing the different role names available in the application.
 * Each role corresponds to a specific set of permissions.
 */
export enum RoleNames {
	USER = "user", // Regular user role
	MODERATOR = "moderator", // Role for users who can moderate content
	ADMIN = "admin", // Admin role with full access
}

/**
 * Type definition for Role, which maps each RoleName to an array of
 * PermissionsBitfield. This defines the permissions associated with
 * each role.
 */
export type Role = Record<RoleNames, PermissionsBitfield[]>;

/**
 * Object that defines the permissions associated with each role.
 * Each role maps to an array of PermissionsBitfield, specifying what actions
 * each role can perform in the application.
 */
export const rolePermissions: Role = {
	user: [PermissionsBitfield.DEFAULT], // Regular users have default permissions
	moderator: [
		PermissionsBitfield.DEFAULT,
		PermissionsBitfield.MANAGE_BLOG, // Moderators can manage blogs
	],
	admin: [
		PermissionsBitfield.DEFAULT,
		PermissionsBitfield.MANAGE_BLOG, // Admins can manage blogs
		PermissionsBitfield.MANAGE_USERS, // Admins can manage users
	],
};
