import {
	RoleNames,
	rolePermissions,
} from "../types/permissions";

/**
 * Function to calculate the effective permissions for a given role.
 * It takes the role as input and combines its associated permissions
 * into a single bitfield number.
 *
 * @param role - The role for which to calculate permissions.
 * @returns The combined permissions as a number (bitfield).
 */
export function calculatePermissions(
	role: RoleNames, // Role is restricted to the keys of Role type
): number {
	// Reduce the array of permissions to a single number using bitwise OR
	return rolePermissions[role].reduce(
		(acc, perm) => acc | perm, // Combine each permission into the accumulator
		0, // Initial value for the accumulator
	);
}
