import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name:"dr4vbm8xh",
  api_key:"787832661464291",
api_secret:"lqPumDb0YyzDh42FF4btuFXUvwI"
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided for upload");
      return null;
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.error(`File does not exist at path: ${localFilePath}`);
      return null;
    }

    // Upload the file to cloudinary
    console.log(`Uploading file to cloudinary: ${localFilePath}`);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    console.log(`File uploaded successfully to: ${response.url}`);
    
    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    console.error(`Error uploading to cloudinary: ${error.message}`);
    
    // Only attempt to delete the file if it exists
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`Temporary file deleted: ${localFilePath}`);
      }
    } catch (unlinkError) {
      console.error(`Error deleting temporary file: ${unlinkError.message}`);
    }
    
    return null;
  }
};

export { uploadOnCloudinary };