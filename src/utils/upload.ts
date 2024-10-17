import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";

/**
 * Path for storing uploaded images in the 'public/images' directory.
 */
const uploadsDir = path.join(
	__dirname,
	"..",
	"public",
	"images",
);

/**
 * Check if the uploads directory exists, and create it if it doesn't.
 */
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

/**
 * Multer storage configuration to handle file destinations and filenames.
 */
const storage = multer.diskStorage({
	/**
	 * Sets the destination for the uploaded files.
	 *
	 * @param req - Express request object
	 * @param file - File being uploaded
	 * @param cb - Callback function to set the destination
	 */
	destination: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void,
	) => {
		cb(null, uploadsDir); // Store files in the uploads directory
	},

	/**
	 * Generates a unique filename for each uploaded file to avoid overwrites.
	 *
	 * @param req - Express request object
	 * @param file - File being uploaded
	 * @param cb - Callback function to set the file name
	 */
	filename: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void,
	) => {
		const uniqueSuffix =
			Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			uniqueSuffix + path.extname(file.originalname),
		); // Append the original file extension
	},
});

/**
 * File filter to restrict file uploads to certain types (JPG, JPEG, PNG).
 *
 * @param req - Express request object
 * @param file - File being uploaded
 * @param cb - Callback function to accept or reject the file
 */
const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback,
): void => {
	const allowedMimeTypes = [
		"image/jpg",
		"image/jpeg",
		"image/png",
	]; // Allowed file types

	if (!allowedMimeTypes.includes(file.mimetype)) {
		return cb(new Error("Invalid file type")); // Reject file if not an image
	}

	return cb(null, true); // Accept file
};

/**
 * Multer configuration, including storage, file filtering, and file size limits.
 */
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 1024 * 1024 * 5 }, // Set file size limit to 5MB
});

export default upload;
