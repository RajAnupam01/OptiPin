import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
import {ApiError }from "../utils/ApiError.js"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const uploadImageToCloudinary = async (localFilePath, folder = 'general') => {
//   const resolvedPath = path.resolve(localFilePath);

//   try {
//     const result = await cloudinary.uploader.upload(resolvedPath, {
//       folder,
//       resource_type: "image",
//     });

//     if (fs.existsSync(resolvedPath)) {
//       fs.unlinkSync(resolvedPath);
//     }

//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//     };
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error.message, error.stack);

//     if (fs.existsSync(resolvedPath)) {
//       fs.unlinkSync(resolvedPath);
//     }

//     throw new ApiError(500, "Failed to upload image to Cloudinary");
//   }
// };

export const uploadImageToCloudinary = (buffer, folder = 'general') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(new ApiError(500, "Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    stream.end(buffer);
  });
};


export const deleteImageFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Image Destroy Error:", error.message, error.stack);

    throw new ApiError(500, "Failed to destroy image from Cloudinary");
  }
};




