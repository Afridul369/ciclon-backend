require('dotenv').config()
const fs = require('fs')
const { customError } = require("../utils/customError");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// upload image
exports.uploadCloudinaryImage = async (filePath) => {
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(filePath,{
        auto:"format",
        quality:"auto",
        fetch_format:"auto",
        resource_type:"image",
    });
    
    const url = await cloudinary.url(result.public_id, {resource_type:"image"})
    // unlink the image from file
    fs.unlinkSync(filePath)
    return url
  } catch (error) {
    console.error("Error From Cloudinary File",error)
    throw new customError(401,error.message)
  }
};

// delete image
exports.deleteCloudinaryImage = async(deletefileId)=>{
  try {
      const response = await cloudinary.uploader.destroy(deletefileId);
      return response.result
  } catch (error) {
      console.log("Error From Delete Cloudinary File", error);
      throw new customError(500, error.message)
  }
    
}
