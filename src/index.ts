import type { Server } from "http";
import { initServer } from "./app";
import { connect, disconnect } from "./database/index";

/**
 * The main function initializes the server and handles database connection.
 * If the connection is successful, the server is started by calling initServer().
 * If the connection fails, the process will exit with status 1.
 *
 * @returns A Promise that resolves to the Server instance created by initServer.
 */
async function main(): Promise<Server> {
	// Attempt to connect to the database
	const isConnected = await connect();

	// If the connection fails, exit the process with an error code
	if (!isConnected) {
		process.exit(1);
	}

	// Start the server and return the Server instance
	return initServer();
}

// Start the server by calling the main function
const server = main();

/**
 * Gracefully handle the SIGINT signal (e.g., CTRL+C or termination).
 * This ensures the server and the database connection are closed properly.
 */
process.on("SIGINT", async () => {
	// Disconnect from the database
	await disconnect();

	// Close the server and stop accepting new connections
	(await server).close();
});
