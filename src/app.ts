import express from "express";
import cors from "cors";
import type { Server } from "http";
import configuration from "./utils/configuration";
import helmet from "helmet";
import morgan from "morgan";
import notFoundError from "./middlewares/notFoundError";
import globalError from "./middlewares/globalError";
import logger from "./utils/logger";
import router from "./routes/routes";
import path from "path";

/**
 * Create an instance of the Express application.
 */
const app = express();

/**
 * Enable CORS (Cross-Origin Resource Sharing) for specified origins.
 * This allows the application to accept requests from different domains.
 *
 * @example
 * Access-Control-Allow-Origin: <allowed-origin>
 */
app.use(
	cors({
		origin: configuration.ALLOW_LIST, // Only allow specified origins
		methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
		optionsSuccessStatus: 204, // Status code to send for successful OPTIONS requests
	}),
);

/**
 * Set security-related HTTP headers using Helmet.
 * This helps protect the app from well-known web vulnerabilities
 * by setting appropriate HTTP headers.
 */
app.use(helmet());

/**
 * Parse incoming requests with JSON payloads.
 * This middleware parses the incoming request body and makes it available as req.body.
 */
app.use(express.json());

/**
 * Parse incoming requests with URL-encoded payloads.
 * This is useful when receiving form submissions or simple data in the URL.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Serve static files from the 'public' directory.
 * For example, files in 'public/images' can be accessed via /images.
 */
app.use(
	express.static(path.join(__dirname, "..", "public")),
);

/**
 * Enable request logging using Morgan.
 * The logging format varies based on the environment (development or production).
 */
app.use(
	morgan(
		configuration.NODE_ENV === "development"
			? "dev" // Concise output during development
			: "combined", // Standard Apache combined log output for production
	),
);

/**
 * Use the router for handling application routes.
 * All routes will be defined in the router module.
 */
app.use(router);

/**
 * Define a catch-all route to handle 404 Not Found errors.
 * This middleware will be called when no other route matches the incoming request.
 */
app.use("*", notFoundError);

/**
 * Global error handling middleware to catch and handle errors
 * that occur anywhere in the application.
 */
app.use(globalError);

/**
 * Initialize the server and start listening on the specified port.
 * The default port is taken from the configuration, but can be overridden.
 *
 * @param port - The port number on which the server will listen (default: configuration.PORT).
 * @returns A Server instance, which can be used to manage the server lifecycle.
 */
export function initServer(
	port: number = configuration.PORT,
): Server {
	return app.listen(port, () => {
		logger.info(
			`Server is listening at http://localhost:${port.toString()}`,
		);
	});
}

/**
 * Export the Express application instance for use in other modules.
 * This allows the app to be easily imported and used in tests or other parts of the code.
 */
export default app;
