import {
	type Request,
	type Response,
	Router,
} from "express";
import configuration from "../utils/configuration";
import getHome from "./homes";
import register from "./auth/register";
import login from "./auth/login";
import authentication from "../middlewares/authentication";
import { refreshToken } from "./auth/refresh-token";

/**
 * Create a new Router instance.
 * This router will be used to define the various API endpoints and their handlers.
 */
const router = Router();

/**
 * Define the base URL for API versioning.
 * This will dynamically include the API version from the configuration.
 */
const baseURL = `/api/v${configuration.API_VERSION.toString()}`;

/**
 * Define the base URL for authentication-related routes.
 */
const authURL = `${baseURL}/auth`;

/**
 * Redirects from the root endpoint ("/") to the base API URL.
 * This route handles GET requests to the root ("/") and redirects users to the base API URL.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A redirection response to the base API URL.
 */
router.get("/", (req: Request, res: Response) => {
	return res.redirect(baseURL);
});

/**
 * Define the GET route for the base API URL.
 * This route handles GET requests to the base URL and calls the getHome function to return home data.
 *
 * @returns A JSON response with the home data.
 */
router.get(baseURL, getHome);

/**
 * POST route for user registration.
 * This route handles user registration by calling the register function.
 */
router.post(`${authURL}/register`, register);

/**
 * POST route for user login.
 * This route handles user login by calling the login function.
 */
router.post(`${authURL}/login`, login);

/**
 * POST route for refreshing the authentication token.
 * This route requires the user to be authenticated (via the authentication middleware),
 * and it calls the refreshToken function to handle token refresh logic.
 */
router.post(
	`${authURL}/refresh-token`,
	authentication,
	refreshToken,
);

/**
 * Export the router instance for use in other modules.
 * This allows the router to be integrated into the main application.
 */
export default router;
