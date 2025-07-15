const cloudinary = require("cloudinary");
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_project',
    allowedFormats : ["png","jpeg","jpg"], // supports promises as well
  },
});

module.exports ={
    cloudinary,storage
};