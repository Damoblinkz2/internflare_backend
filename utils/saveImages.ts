import { Jimp } from "jimp";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const IMAGE_DIR = path.resolve("uploads/images");

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const ALLOWED_MIME_TYPES = new Set(Object.keys(MIME_TO_EXTENSION));

await fs.mkdir(IMAGE_DIR, { recursive: true });

const saveImage = async (buffer: Buffer): Promise<string> => {
  let image: any;

  try {
    image = await Jimp.read(buffer); // real decode attempt
  } catch {
    throw new Error("Invalid image data");
  }

  const mime = image.getMIME();

  if (!ALLOWED_MIME_TYPES.has(mime)) {
    throw new Error("Unsupported image format");
  }

  // Security hardening
  if (image.bitmap.width > 5000 || image.bitmap.height > 5000) {
    throw new Error("Image dimensions too large");
    // if (!req.file) return next(new AppError("no resume uploaded", 400));
  }

  // Normalize & strip metadata
  image.resize({ w: 2048 }); // optional max width
  image.quality(85); // JPEG compression
  image.background = 0xffffffff; // avoid transparent exploits

  const extension = MIME_TO_EXTENSION[mime];
  const filename = `${randomUUID()}${extension}`;
  const filepath = path.join(IMAGE_DIR, filename);

  await image.write(filepath);

  return filename;
};

export default saveImage;
