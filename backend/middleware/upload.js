import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "uploads", // Folder name in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowed file formats
      public_id: `${file.fieldname}-${Date.now()}}`,
    };
  },
});
const upload = multer({ storage });
export default upload;