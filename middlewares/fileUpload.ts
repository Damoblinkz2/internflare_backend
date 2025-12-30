import multer from "multer";
import path from "path";
import { AppError } from "../utils/appError.js";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Excel (optional, but common)
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // Text
  "text/plain",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    cb(null, `${safeName}-${Date.now()}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Unsupported file type", 415));
  }
};

const uploadFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB MAX FILE SIZE
  },
});

export { uploadFile, ALLOWED_MIME_TYPES };
