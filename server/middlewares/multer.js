import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    // Determine the upload path based on the field name
    if (file.fieldname === "postImage") {
      uploadPath = path.join("uploads", "posts");
    } else if (file.fieldname === "productImage") {
      uploadPath = path.join("uploads", "products");
    } else if (file.fieldname === "avatar") {
      uploadPath = path.join("uploads", "avatars");
    } else {
      uploadPath = path.join("uploads", "others");
    }

    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG, GIF) are allowed!"));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Export middleware for specific use cases
export const uploadPostImage = upload.single("postImage");
export const uploadProductImage = upload.single("productImage");
export const uploadAvatar = upload.single("avatar");