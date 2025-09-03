const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    //default names do not change
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg", "avif"], // supports promises as well
    //public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports = { cloudinary, storage };


// // cloudConfig.js
// const cloudinary = require("cloudinary").v2;
// const dotenv = require("dotenv");

// dotenv.config(); // 👈 load .env file

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// module.exports = { cloudinary };
